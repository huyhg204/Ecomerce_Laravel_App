<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class VoucherController extends Controller
{
    public function index(Request $request)
    {
        if ($request->expectsJson()) {
            $perPage = $request->input('per_page', 20);
            $page = $request->input('page', 1);
            $offset = ($page - 1) * $perPage;
            
            $total = DB::table('vouchers')->count();
            
            $vouchers = DB::table('vouchers')
                ->orderByDesc('id')
                ->offset($offset)
                ->limit($perPage)
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'vouchers' => $vouchers,
                    'pagination' => [
                        'current_page' => (int)$page,
                        'per_page' => (int)$perPage,
                        'total' => $total,
                        'last_page' => ceil($total / $perPage)
                    ]
                ]
            ]);
        }

        $vouchers = DB::table('vouchers')->orderByDesc('id')->get();
        return view('admin.pages.voucher.index', compact('vouchers'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:vouchers,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            return redirect()->back()->withErrors($validator)->withInput();
        }

        DB::table('vouchers')->insert([
            'code' => strtoupper($request->code),
            'name' => $request->name,
            'description' => $request->description,
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->input('min_order_amount', 0),
            'max_discount_amount' => $request->max_discount_amount,
            'usage_limit' => $request->usage_limit,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_active' => $request->input('is_active', true),
            'used_count' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Voucher Created'], 201);
        }
        return redirect()->route('admin.voucher.index')->with('success', 'Thêm voucher thành công');
    }

    public function show($id, Request $request)
    {
        $voucher = DB::table('vouchers')->where('id', $id)->first();
        
        if (!$voucher) {
            if ($request->expectsJson()) {
                return response()->json(['status' => 'error', 'message' => 'Voucher not found'], 404);
            }
            return redirect()->route('admin.voucher.index')->with('error', 'Voucher không tồn tại');
        }

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'data' => $voucher]);
        }
        return view('admin.pages.voucher.show', compact('voucher'));
    }

    public function update(Request $request, $id)
    {
        $voucher = DB::table('vouchers')->where('id', $id)->first();
        
        if (!$voucher) {
            if ($request->expectsJson()) {
                return response()->json(['status' => 'error', 'message' => 'Voucher not found'], 404);
            }
            return redirect()->route('admin.voucher.index')->with('error', 'Voucher không tồn tại');
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:vouchers,code,' . $id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            return redirect()->back()->withErrors($validator)->withInput();
        }

        DB::table('vouchers')->where('id', $id)->update([
            'code' => strtoupper($request->code),
            'name' => $request->name,
            'description' => $request->description,
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->input('min_order_amount', 0),
            'max_discount_amount' => $request->max_discount_amount,
            'usage_limit' => $request->usage_limit,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_active' => $request->input('is_active', true),
            'updated_at' => now(),
        ]);

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Voucher Updated']);
        }
        return redirect()->route('admin.voucher.index')->with('success', 'Cập nhật voucher thành công');
    }

    public function destroy($id, Request $request)
    {
        $voucher = DB::table('vouchers')->where('id', $id)->first();
        
        if (!$voucher) {
            if ($request->expectsJson()) {
                return response()->json(['status' => 'error', 'message' => 'Voucher not found'], 404);
            }
            return redirect()->route('admin.voucher.index')->with('error', 'Voucher không tồn tại');
        }

        DB::table('vouchers')->where('id', $id)->delete();

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Voucher Deleted']);
        }
        return redirect()->route('admin.voucher.index')->with('success', 'Xóa voucher thành công');
    }

    /**
     * API để kiểm tra và áp dụng voucher (cho user)
     */
    public function validateVoucher(Request $request)
    {
        $code = $request->input('code');
        $totalAmount = $request->input('total_amount', 0);

        if (empty($code)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mã voucher không được để trống'
            ], 400);
        }

        $voucher = DB::table('vouchers')
            ->where('code', strtoupper($code))
            ->where('is_active', true)
            ->first();

        if (!$voucher) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mã voucher không tồn tại hoặc đã bị vô hiệu hóa'
            ], 404);
        }

        $now = Carbon::now();
        $startDate = Carbon::parse($voucher->start_date);
        $endDate = Carbon::parse($voucher->end_date);

        // Kiểm tra thời gian hiệu lực
        if ($now->lt($startDate)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Voucher chưa đến thời gian sử dụng'
            ], 400);
        }

        if ($now->gt($endDate)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Voucher đã hết hạn'
            ], 400);
        }

        // Kiểm tra số lần sử dụng
        if ($voucher->usage_limit && $voucher->used_count >= $voucher->usage_limit) {
            return response()->json([
                'status' => 'error',
                'message' => 'Voucher đã hết lượt sử dụng'
            ], 400);
        }

        // Kiểm tra đơn hàng tối thiểu
        if ($totalAmount < $voucher->min_order_amount) {
            return response()->json([
                'status' => 'error',
                'message' => 'Đơn hàng tối thiểu là ' . number_format($voucher->min_order_amount, 0, ',', '.') . '₫'
            ], 400);
        }

        // Tính toán số tiền giảm
        $discountAmount = 0;
        if ($voucher->type === 'percent') {
            $discountAmount = $totalAmount * ($voucher->value / 100);
            if ($voucher->max_discount_amount && $discountAmount > $voucher->max_discount_amount) {
                $discountAmount = $voucher->max_discount_amount;
            }
        } else {
            $discountAmount = $voucher->value;
            if ($discountAmount > $totalAmount) {
                $discountAmount = $totalAmount;
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'voucher' => $voucher,
                'discount_amount' => round($discountAmount, 2),
                'final_amount' => round($totalAmount - $discountAmount, 2)
            ]
        ]);
    }
}
