<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class RevenueController extends Controller
{
    public function index(Request $request)
    {
        // 1. Lấy tham số từ request (Mặc định lấy ngày hiện tại nếu không gửi lên)
        $date = $request->input('date', Carbon::now()->toDateString());
        $timePeriod = $request->input('time_period', 'day');

        // 2. Helper function để tạo base query filter theo thời gian
        $baseQuery = function($table) use ($date, $timePeriod) {
            $q = DB::table($table);
            if ($timePeriod == 'day') {
                $q->whereDate('date_order', $date);
            } elseif ($timePeriod == 'month') {
                try {
                    $parsedDate = Carbon::parse($date);
                    $q->whereMonth('date_order', $parsedDate->month)
                      ->whereYear('date_order', $parsedDate->year);
                } catch (\Exception $e) {
                    // Fallback
                }
            } elseif ($timePeriod == 'year') {
                $q->whereYear('date_order', $date);
            }
            return $q;
        };

        // 3. TỔNG SẢN PHẨM (tất cả sản phẩm, không filter theo ngày vì sản phẩm không có date)
        // Cache 5 phút vì sản phẩm ít thay đổi
        $totalProducts = Cache::remember('dashboard_total_products', 300, function () {
            return DB::table('products')
                ->where('status_product', 0) // Chỉ tính sản phẩm đang hiển thị
                ->count();
        });

        // 4. TỔNG ĐƠN HÀNG (theo ngày/tháng/năm)
        // Cache theo date và period (cache ngắn hơn vì orders thay đổi thường xuyên)
        $ordersCacheKey = 'dashboard_total_orders_' . $date . '_' . $timePeriod;
        $totalOrders = Cache::remember($ordersCacheKey, 300, function () use ($baseQuery) {
            return $baseQuery('orders')->count();
        });

        // 5. TỔNG NGƯỜI DÙNG (tất cả users, không filter theo ngày)
        // Cache 5 phút vì users ít thay đổi
        $totalUsers = Cache::remember('dashboard_total_users', 300, function () {
            return DB::table('users')
                ->where('role_user', 0) // Chỉ tính users (không tính admin)
                ->where('status_user', 0) // Chỉ tính users đang active
                ->count();
        });

        // 6. TỔNG DOANH THU (theo ngày/tháng/năm)
        // Cache theo date và period
        $revenueCacheKey = 'dashboard_total_revenue_' . $date . '_' . $timePeriod;
        $totalRevenue = Cache::remember($revenueCacheKey, 300, function () use ($baseQuery) {
            return $baseQuery('orders')->sum('total_order');
        });

        // 7. SẢN PHẨM BÁN CHẠY (top 10, theo ngày/tháng/năm)
        $cacheKey = 'dashboard_top_products_' . $date . '_' . $timePeriod;
        $topProducts = Cache::remember($cacheKey, 900, function () use ($date, $timePeriod) {
            $query = DB::table('order_details')
                ->join('orders', 'orders.id', '=', 'order_details.order_id')
                ->join('products', 'products.id', '=', 'order_details.product_id')
                ->select(
                    'order_details.product_id',
                    'products.name_product',
                    'products.image_product',
                    'products.price_product',
                    DB::raw('SUM(order_details.quantity_detail) as quantity_sold'),
                    DB::raw('SUM(order_details.total_detail) as total_revenue')
                )
                ->where('products.status_product', 0); // Chỉ tính sản phẩm đang hiển thị
            
            // Áp dụng filter thời gian
            if ($timePeriod == 'day') {
                $query->whereDate('orders.date_order', $date);
            } elseif ($timePeriod == 'month') {
                try {
                    $parsedDate = Carbon::parse($date);
                    $query->whereMonth('orders.date_order', $parsedDate->month)
                          ->whereYear('orders.date_order', $parsedDate->year);
                } catch (\Exception $e) {
                    // Fallback
                }
            } elseif ($timePeriod == 'year') {
                $query->whereYear('orders.date_order', $date);
            }
            
            return $query->groupBy(
                    'order_details.product_id',
                    'products.name_product',
                    'products.image_product',
                    'products.price_product'
                )
                ->orderByDesc('quantity_sold')
                ->take(10)
                ->get();
        });

        // 8. TRẢ VỀ JSON
        return response()->json([
            'status' => 'success',
            'data' => [
                'summary' => [
                    'total_products' => $totalProducts,
                    'total_orders' => $totalOrders,
                    'total_users' => $totalUsers,
                    'total_revenue' => (float)$totalRevenue
                ],
                'top_products' => $topProducts,
                'filter' => [
                    'date' => $date,
                    'period' => $timePeriod,
                    'note' => 'Sản phẩm và Users không filter theo ngày. Orders và Revenue filter theo ' . $timePeriod
                ]
            ]
        ], 200);
    }
}
