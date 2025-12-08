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

    /**
     * Thống kê đơn hàng 7 ngày gần nhất
     * Có thể filter theo ngày bắt đầu
     */
    public function getLast7DaysStats(Request $request)
    {
        // Lấy ngày bắt đầu từ request (mặc định là 7 ngày trước)
        $startDate = $request->input('start_date', Carbon::now()->subDays(6)->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());

        try {
            // Parse dates
            $start = Carbon::parse($startDate)->startOfDay();
            $end = Carbon::parse($endDate)->endOfDay();

            // Tạo mảng 7 ngày
            $days = [];
            $currentDate = $start->copy();
            
            while ($currentDate <= $end) {
                $days[] = $currentDate->copy();
                $currentDate->addDay();
            }

            // Lấy dữ liệu đơn hàng trong khoảng thời gian
            $orders = DB::table('orders')
                ->select(
                    DB::raw('DATE(date_order) as order_date'),
                    DB::raw('COUNT(*) as total_orders'),
                    DB::raw('SUM(total_order) as total_revenue'),
                    DB::raw('SUM(CASE WHEN status_order = 2 THEN 1 ELSE 0 END) as completed_orders'),
                    DB::raw('SUM(CASE WHEN status_order = 0 THEN 1 ELSE 0 END) as pending_orders'),
                    DB::raw('SUM(CASE WHEN status_order = 1 THEN 1 ELSE 0 END) as processing_orders')
                )
                ->whereBetween('date_order', [$start, $end])
                ->groupBy(DB::raw('DATE(date_order)'))
                ->orderBy('order_date')
                ->get();

            // Tạo map để dễ dàng lookup
            $ordersMap = [];
            foreach ($orders as $order) {
                $ordersMap[$order->order_date] = $order;
            }

            // Tạo dữ liệu cho chart (đảm bảo có đủ 7 ngày)
            $chartData = [];
            foreach ($days as $day) {
                $dateKey = $day->toDateString();
                $orderData = $ordersMap[$dateKey] ?? null;

                $chartData[] = [
                    'date' => $dateKey,
                    'date_label' => $day->format('d/m/Y'),
                    'day_label' => $day->format('D'),
                    'total_orders' => (int)($orderData->total_orders ?? 0),
                    'total_revenue' => (float)($orderData->total_revenue ?? 0),
                    'completed_orders' => (int)($orderData->completed_orders ?? 0),
                    'pending_orders' => (int)($orderData->pending_orders ?? 0),
                    'processing_orders' => (int)($orderData->processing_orders ?? 0),
                ];
            }

            // Tính tổng
            $summary = [
                'total_orders' => array_sum(array_column($chartData, 'total_orders')),
                'total_revenue' => array_sum(array_column($chartData, 'total_revenue')),
                'total_completed' => array_sum(array_column($chartData, 'completed_orders')),
                'total_pending' => array_sum(array_column($chartData, 'pending_orders')),
                'total_processing' => array_sum(array_column($chartData, 'processing_orders')),
            ];

            return response()->json([
                'status' => 'success',
                'data' => [
                    'chart_data' => $chartData,
                    'summary' => $summary,
                    'date_range' => [
                        'start_date' => $start->toDateString(),
                        'end_date' => $end->toDateString(),
                        'days_count' => count($days)
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi lấy dữ liệu thống kê: ' . $e->getMessage()
            ], 500);
        }
    }
}
