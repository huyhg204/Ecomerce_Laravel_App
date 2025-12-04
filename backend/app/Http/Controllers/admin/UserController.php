<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Pagination cho API
        if ($request->expectsJson()) {
            $perPage = $request->input('per_page', 20);
            $page = $request->input('page', 1);
            $offset = ($page - 1) * $perPage;
            
            $total = DB::table('users')
                ->where('role_user', 0)
                ->count();
            
            $users = DB::table('users')
                ->leftJoin('orders', 'users.id', '=', 'orders.user_id')
                ->select(
                    'users.id', 'users.name', 'users.email', 'users.phone', 'users.status_user',
                    DB::raw('COUNT(orders.id) as total_orders'),
                    DB::raw('COALESCE(SUM(orders.total_order), 0) as total_spent')
                )
                ->where('users.role_user', 0)
                ->groupBy('users.id', 'users.name', 'users.email', 'users.phone', 'users.status_user')
                ->orderByDesc('users.id')
                ->offset($offset)
                ->limit($perPage)
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'users' => $users,
                    'pagination' => [
                        'current_page' => (int)$page,
                        'per_page' => (int)$perPage,
                        'total' => $total,
                        'last_page' => ceil($total / $perPage)
                    ]
                ]
            ]);
        }

        // Web view - không pagination
        $users = DB::table('users')
            ->leftJoin('orders', 'users.id', '=', 'orders.user_id')
            ->select(
                'users.id', 'users.name', 'users.email', 'users.phone', 'users.status_user',
                DB::raw('COUNT(orders.id) as total_orders'),
                DB::raw('COALESCE(SUM(orders.total_order), 0) as total_spent')
            )
            ->where('role_user', 0)
            ->groupBy('users.id', 'users.name', 'users.email', 'users.phone', 'users.status_user')
            ->orderByDesc('users.id')
            ->get();

        return view('admin.pages.user.index', compact('users'));
    }

    public function destroy($id, Request $request) {
        DB::table('users')->where('id', $id)->update(['status_user' => 1]);
        
        // Clear dashboard cache khi block user
        Cache::forget('dashboard_total_users');
        
        if ($request->expectsJson()) return response()->json(['status' => 'success', 'message' => 'Blocked']);
        return redirect()->route('admin.user.index');
    }

    public function restore($id, Request $request) {
        DB::table('users')->where('id', $id)->update(['status_user' => 0]);
        
        // Clear dashboard cache khi restore user
        Cache::forget('dashboard_total_users');
        
        if ($request->expectsJson()) return response()->json(['status' => 'success', 'message' => 'Restored']);
        return redirect()->route('admin.user.index');
    }
}
