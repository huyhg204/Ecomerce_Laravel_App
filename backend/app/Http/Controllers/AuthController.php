<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
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

    // Giữ lại hàm này để tránh lỗi nếu route web cũ còn gọi, nhưng API không dùng
    public function showAuthForm() {
        return response()->json(['message' => 'Please use POST /api/login'], 404);
    }
}
