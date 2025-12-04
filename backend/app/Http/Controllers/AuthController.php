<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use App\Models\User;

class AuthController extends Controller
{
    // API Đăng nhập
    public function login(Request $request)
    {
        // Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        // Kiểm tra đăng nhập
        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // Kiểm tra trạng thái tài khoản
            if ($user->status_user == 1) {
                return response()->json(['status' => 'error', 'message' => 'Tài khoản đã bị vô hiệu hóa.'], 403);
            }

            // Tạo Token (Đây là chìa khóa cho ReactJS)
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Đăng nhập thành công',
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]
            ], 200);
        }

        return response()->json(['status' => 'error', 'message' => 'Email hoặc mật khẩu không đúng.'], 401);
    }

    // API Đăng ký
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'address'  => 'required|string|max:255',
            'phone'    => 'required|string|size:10|unique:users,phone',
        ], [
            'name.required' => 'Họ và tên là bắt buộc',
            'name.max' => 'Họ và tên không được vượt quá 255 ký tự',
            'email.required' => 'Email là bắt buộc',
            'email.email' => 'Email không hợp lệ',
            'email.max' => 'Email không được vượt quá 255 ký tự',
            'email.unique' => 'Email này đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.',
            'password.required' => 'Mật khẩu là bắt buộc',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp',
            'address.required' => 'Địa chỉ là bắt buộc',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự',
            'phone.required' => 'Số điện thoại là bắt buộc',
            'phone.size' => 'Số điện thoại phải có đúng 10 chữ số',
            'phone.unique' => 'Số điện thoại này đã được sử dụng. Vui lòng sử dụng số điện thoại khác hoặc đăng nhập.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        // Tạo user mới
        $user = User::create([
            'name'         => $request->name,
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
            'address'      => $request->address,
            'phone'        => $request->phone,
            'role_user'    => 0, // Mặc định là khách hàng
            'status_user'  => 0, // 0: Active
        ]);

        // Tạo token ngay sau khi đăng ký để tự động đăng nhập
        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng ký thành công',
            'data' => [
                'user' => $user,
                'access_token' => $token
            ]
        ], 201);
    }

    // API Đăng xuất
    public function logout(Request $request)
    {
        // Xóa token hiện tại
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng xuất thành công'
        ], 200);
    }

    // API Cập nhật thông tin user
    public function updateProfile(Request $request)
    {
        // Kiểm tra user đã đăng nhập
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Chưa đăng nhập.'], 401);
        }

        // Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6|confirmed',
            'address'  => 'sometimes|string|max:255',
            'phone'    => 'sometimes|string|size:10|unique:users,phone,' . $user->id,
        ], [
            'name.max' => 'Họ và tên không được vượt quá 255 ký tự',
            'email.email' => 'Email không hợp lệ',
            'email.max' => 'Email không được vượt quá 255 ký tự',
            'email.unique' => 'Email này đã được sử dụng. Vui lòng sử dụng email khác.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự',
            'phone.size' => 'Số điện thoại phải có đúng 10 chữ số',
            'phone.unique' => 'Số điện thoại này đã được sử dụng. Vui lòng sử dụng số điện thoại khác.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        // Chuẩn bị dữ liệu cập nhật
        $updateData = [];

        if ($request->has('name')) {
            $updateData['name'] = $request->name;
        }

        if ($request->has('email')) {
            $updateData['email'] = $request->email;
        }

        if ($request->has('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        if ($request->has('address')) {
            $updateData['address'] = $request->address;
        }

        if ($request->has('phone')) {
            $updateData['phone'] = $request->phone;
        }

        // Kiểm tra có dữ liệu để cập nhật không
        if (empty($updateData)) {
            return response()->json(['status' => 'error', 'message' => 'Không có dữ liệu để cập nhật.'], 400);
        }

        // Cập nhật thông tin user
        $user->update($updateData);

        // Làm mới model để lấy dữ liệu mới nhất
        $user->refresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật thông tin thành công',
            'data' => [
                'user' => $user
            ]
        ], 200);
    }

    // API Quên mật khẩu - Gửi OTP
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Email là bắt buộc',
            'email.email' => 'Email không hợp lệ',
            'email.exists' => 'Email này chưa được đăng ký trong hệ thống',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $user = DB::table('users')->where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email này chưa được đăng ký trong hệ thống'
            ], 404);
        }

        // Kiểm tra rate limit - chỉ cho phép gửi OTP mỗi 60 giây
        $recentOtp = DB::table('password_reset_otps')
            ->where('email', $email)
            ->where('created_at', '>', Carbon::now()->subSeconds(60))
            ->first();

        if ($recentOtp) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng đợi 60 giây trước khi yêu cầu OTP mới'
            ], 429);
        }

        // Tạo OTP 6 chữ số
        $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = Carbon::now()->addMinutes(10); // OTP hết hạn sau 10 phút

        // Xóa các OTP cũ của email này
        DB::table('password_reset_otps')
            ->where('email', $email)
            ->delete();

        // Lưu OTP mới
        DB::table('password_reset_otps')->insert([
            'email' => $email,
            'otp' => $otp,
            'expires_at' => $expiresAt,
            'used' => false,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Gửi email OTP
        try {
            $mailer = config('mail.default');
            \Log::info('Đang gửi email OTP', [
                'email' => $email,
                'mailer' => $mailer,
                'otp' => $otp
            ]);

            Mail::send('emails.password-reset-otp', [
                'otp' => $otp,
                'user_name' => $user->name,
                'expires_in' => 10
            ], function ($message) use ($email, $user) {
                $message->to($email, $user->name ?? 'Người dùng')
                        ->subject('Mã OTP đặt lại mật khẩu');
            });

            // Nếu dùng log driver, thông báo cho user biết
            if ($mailer === 'log') {
                \Log::info('Email OTP đã được ghi vào log (MAIL_MAILER=log)', [
                    'email' => $email,
                    'otp' => $otp,
                    'log_file' => storage_path('logs/laravel.log')
                ]);
                
                return response()->json([
                    'status' => 'success',
                    'message' => 'Mã OTP đã được tạo. Vui lòng kiểm tra file log tại: storage/logs/laravel.log (MAIL_MAILER đang là "log")',
                    'data' => [
                        'email' => $email,
                        'expires_at' => $expiresAt->toDateTimeString(),
                        'otp' => $otp, // Tạm thời trả về OTP để test (nên xóa trong production)
                        'note' => 'Đang dùng log driver. Cấu hình SMTP trong .env để gửi email thực sự.'
                    ]
                ], 200);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến.',
                'data' => [
                    'email' => $email,
                    'expires_at' => $expiresAt->toDateTimeString()
                ]
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Lỗi gửi email OTP', [
                'email' => $email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể gửi email. Vui lòng thử lại sau.',
                'error_detail' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    // API Xác thực OTP
    public function verifyOTP(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ], [
            'email.required' => 'Email là bắt buộc',
            'email.email' => 'Email không hợp lệ',
            'otp.required' => 'Mã OTP là bắt buộc',
            'otp.size' => 'Mã OTP phải có 6 chữ số',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $otp = $request->otp;

        // Tìm OTP hợp lệ
        $otpRecord = DB::table('password_reset_otps')
            ->where('email', $email)
            ->where('otp', $otp)
            ->where('used', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu mã mới.'
            ], 400);
        }

        // Tạo token tạm thời để đặt lại mật khẩu
        $resetToken = bin2hex(random_bytes(32));
        $resetTokenExpiresAt = Carbon::now()->addMinutes(30); // Token hết hạn sau 30 phút

        // Đánh dấu OTP đã sử dụng và lưu reset token
        DB::table('password_reset_otps')
            ->where('id', $otpRecord->id)
            ->update([
                'used' => true,
                'reset_token' => $resetToken,
                'reset_token_expires_at' => $resetTokenExpiresAt
            ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Xác thực OTP thành công',
            'data' => [
                'reset_token' => $resetToken,
                'email' => $email,
                'expires_at' => $resetTokenExpiresAt->toDateTimeString()
            ]
        ], 200);
    }

    // API Đặt lại mật khẩu
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'reset_token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'email.required' => 'Email là bắt buộc',
            'email.email' => 'Email không hợp lệ',
            'email.exists' => 'Email không tồn tại trong hệ thống',
            'reset_token.required' => 'Token đặt lại mật khẩu là bắt buộc',
            'password.required' => 'Mật khẩu mới là bắt buộc',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $resetToken = $request->reset_token;
        $newPassword = $request->password;

        // Kiểm tra token từ database
        $tokenRecord = DB::table('password_reset_otps')
            ->where('email', $email)
            ->where('reset_token', $resetToken)
            ->where('reset_token_expires_at', '>', Carbon::now())
            ->where('used', true) // OTP đã được xác thực
            ->first();

        if (!$tokenRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token không hợp lệ hoặc đã hết hạn. Vui lòng thực hiện lại quy trình quên mật khẩu.'
            ], 400);
        }

        // Kiểm tra user có tồn tại không
        $user = DB::table('users')->where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        // Cập nhật mật khẩu mới
        DB::table('users')
            ->where('email', $email)
            ->update([
                'password' => Hash::make($newPassword),
                'updated_at' => Carbon::now()
            ]);

        // Xóa tất cả OTP và reset token của email này
        DB::table('password_reset_otps')
            ->where('email', $email)
            ->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.'
        ], 200);
    }

    // Giữ lại hàm này để tránh lỗi nếu route web cũ còn gọi, nhưng API không dùng
    public function showAuthForm() {
        return response()->json(['message' => 'Please use POST /api/login'], 404);
    }
}
