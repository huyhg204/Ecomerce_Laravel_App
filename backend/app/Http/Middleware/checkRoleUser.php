<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class checkRoleUser
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Chưa đăng nhập
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
            }
            return redirect('/');
        }

        // 2. Đã đăng nhập nhưng không phải User thường (ví dụ là Admin đang test app user)

        if (Auth::user()->role_user !== 0) {
            if ($request->expectsJson()) {
                return response()->json(['status' => 'error', 'message' => 'Forbidden. Customer access only.'], 403);
            }

            if (Auth::user()->role_user == 1) {
                return redirect('/admin');
            }
            return redirect('/');
        }

        return $next($request);
    }
}
