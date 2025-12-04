<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {

                // --- LOGIC API: Trả JSON báo đã login ---
                if ($request->expectsJson()) {
                    return response()->json([
                        'status' => 'success',
                        'message' => 'Already authenticated.',
                        'user' => Auth::user()
                    ], 200);
                }

                // --- LOGIC WEB: Redirect  ---
                if (Auth::user()->role_user == 1) {
                    return redirect('/admin');
                }
                return redirect('/');
            }
        }

        return $next($request);
    }
}
