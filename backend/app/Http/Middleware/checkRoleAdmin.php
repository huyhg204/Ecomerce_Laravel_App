<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class checkRoleAdmin
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Kiểm tra đã đăng nhập chưa
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated. Vui lòng đăng nhập và gửi kèm Token.'
            ], 401);
        }

        // 2. Kiểm tra có phải Admin không (role = 1)
        if (Auth::user()->role_user !== 1) {
            return response()->json([
                'status' => 'error',
                'message' => 'Forbidden. Bạn không có quyền Admin.'
            ], 403);
        }

        return $next($request);
    }
}
