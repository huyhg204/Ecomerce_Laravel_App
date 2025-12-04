<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    // Search Order Public API
    public function searchOrder(Request $request)
    {
        $orderCode = $request->input('order_code');
        if (empty($orderCode)) {
            return response()->json(['status' => 'error', 'message' => 'Mã đơn hàng không được để trống.'], 400);
        }

        $orderId = (int) str_replace('MDH_', '', $orderCode);
        $order = DB::table('orders')->where('id', $orderId)->first();

        if (!$order) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy đơn hàng'], 404);
        }

        $orderDetails = DB::table('order_details')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->where('order_details.order_id', $orderId)
            ->select(
                'products.image_product', 'products.name_product',
                'order_details.quantity_detail', 'order_details.total_detail'
            )->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'order_info' => $order,
                'products' => $orderDetails
            ]
        ], 200);
    }

    public function createOrder(Request $request)
    {
        // Validation các trường bắt buộc
        $request->validate([
            'name_customer' => 'required|string|max:255',
            'phone_customer' => 'required|string|max:20',
            'address_customer' => 'required|string|max:500',
            'method_pay' => 'nullable|integer',
            'note_customer' => 'nullable|string|max:1000',
        ], [
            'name_customer.required' => 'Tên người nhận không được để trống',
            'phone_customer.required' => 'Số điện thoại không được để trống',
            'address_customer.required' => 'Địa chỉ không được để trống',
        ]);

        // Hỗ trợ cả JSON và form-data
        $methodPay = $request->input('method_pay', 0);
        $phoneCustomer = $request->input('phone_customer');
        $addressCustomer = $request->input('address_customer');
        $nameCustomer = $request->input('name_customer');
        $noteCustomer = $request->input('note_customer', null);

        // Kiểm tra lại nếu vẫn null (có thể do JSON request)
        if ($phoneCustomer === null && $request->isJson()) {
            $jsonData = $request->json()->all();
            $phoneCustomer = $jsonData['phone_customer'] ?? null;
            $addressCustomer = $jsonData['address_customer'] ?? null;
            $nameCustomer = $jsonData['name_customer'] ?? null;
            $noteCustomer = $jsonData['note_customer'] ?? null;
            $methodPay = $jsonData['method_pay'] ?? 0;
        }

        // Kiểm tra các trường bắt buộc
        if (empty($nameCustomer) || empty($phoneCustomer) || empty($addressCustomer)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vui lòng điền đầy đủ thông tin: tên người nhận, số điện thoại và địa chỉ',
                    'debug' => [
                        'received_data' => $request->all(),
                        'name_customer' => $nameCustomer,
                        'phone_customer' => $phoneCustomer,
                        'address_customer' => $addressCustomer
                    ]
                ], 400);
            }
            return back()->with('error', 'Vui lòng điền đầy đủ thông tin!');
        }

        $userId = Auth::id();
        $cart = session('cart', []);

            // Nếu cart trong session trống và user đã đăng nhập, lấy từ database
        if (empty($cart) && $userId) {
            $cartFromDb = DB::table('carts')
                ->join('products', 'carts.product_id', '=', 'products.id')
                ->leftJoin('product_attributes', 'carts.product_attribute_id', '=', 'product_attributes.id')
                ->where('carts.user_id', $userId)
                ->select(
                    'carts.product_id', 'carts.quantity_item', 'carts.total_item',
                    'carts.product_attribute_id', 'carts.size',
                    'products.image_product', 'products.name_product', 
                    'products.price_product', 'products.original_price',
                    'products.discount_price', 'products.discount_percent'
                )
                ->get();
            
            $cart = [];
            foreach ($cartFromDb as $item) {
                $actualPrice = $item->discount_price ?? $item->price_product;
                $originalPrice = $item->original_price ?? $item->price_product;
                $cartKey = $item->product_id . ($item->size ? '_' . $item->size : '');
                
                $cart[$cartKey] = [
                    'product_id'    => $item->product_id,
                    'product_attribute_id' => $item->product_attribute_id,
                    'size' => $item->size,
                    'image_product' => $item->image_product,
                    'name_product'  => $item->name_product,
                    'price_product' => $actualPrice,
                    'original_price' => $originalPrice,
                    'discount_price' => $item->discount_price,
                    'discount_percent' => $item->discount_percent,
                    'quantity_item' => $item->quantity_item,
                    'total_item'    => $item->total_item,
                    'total_original' => $item->quantity_item * $originalPrice,
                ];
            }
            
            // Cập nhật session cart từ database
            if (!empty($cart)) {
                session()->put('cart', $cart);
            }
        }

        if (empty($cart)) {
            if ($request->expectsJson()) return response()->json(['status'=>'error', 'message'=>'Giỏ hàng trống'], 400);
            return back()->with('error', 'Giỏ hàng trống!');
        }

        // Tính tổng giá sau giảm (tạm tính)
        $subtotalOrder = array_sum(array_column($cart, 'total_item'));
        
        // Xử lý voucher nếu có
        $voucherCode = $request->input('voucher_code');
        $voucherId = null;
        $voucherDiscount = 0;
        
        if ($voucherCode) {
            $voucher = DB::table('vouchers')
                ->where('code', strtoupper($voucherCode))
                ->where('is_active', true)
                ->first();
            
            if ($voucher) {
                $now = Carbon::now();
                $startDate = Carbon::parse($voucher->start_date);
                $endDate = Carbon::parse($voucher->end_date);
                
                // Kiểm tra thời gian và điều kiện
                if ($now->gte($startDate) && $now->lte($endDate) && 
                    $subtotalOrder >= $voucher->min_order_amount &&
                    (!$voucher->usage_limit || $voucher->used_count < $voucher->usage_limit)) {
                    
                    // Tính số tiền giảm
                    if ($voucher->type === 'percent') {
                        $voucherDiscount = $subtotalOrder * ($voucher->value / 100);
                        if ($voucher->max_discount_amount && $voucherDiscount > $voucher->max_discount_amount) {
                            $voucherDiscount = $voucher->max_discount_amount;
                        }
                    } else {
                        $voucherDiscount = $voucher->value;
                        if ($voucherDiscount > $subtotalOrder) {
                            $voucherDiscount = $subtotalOrder;
                        }
                    }
                    
                    $voucherId = $voucher->id;
                    $voucherCode = $voucher->code;
                }
            }
        }
        
        // Tổng thanh toán cuối cùng = subtotal - voucher discount
        $totalOrder = $subtotalOrder - $voucherDiscount;

        try {
            DB::beginTransaction();

            // Check tồn kho lần cuối
            foreach ($cart as $item) {
                $product = DB::table('products')->where('id', $item['product_id'])->lockForUpdate()->first();
                if (!$product || $product->quantity_product < $item['quantity_item']) {
                    throw new \Exception('Sản phẩm ' . ($product->name_product ?? 'ID '.$item['product_id']) . ' không đủ hàng.');
                }
            }

            $orderId = DB::table('orders')->insertGetId([
                'user_id'          => $userId,
                'method_pay'       => $methodPay,
                'subtotal_order'   => $subtotalOrder,
                'voucher_id'       => $voucherId,
                'voucher_code'     => $voucherCode,
                'voucher_discount' => $voucherDiscount,
                'total_order'      => $totalOrder,
                'phone_customer'   => $phoneCustomer,
                'address_customer' => $addressCustomer,
                'name_customer'    => $nameCustomer,
                'note_customer'    => $noteCustomer,
                'status_order'     => 0,
                'status_delivery'  => null,
                'status_user_order' => null,
                'reason_user_order' => null,
                'date_order'       => now()
            ]);
            
            // Cập nhật số lần sử dụng voucher
            if ($voucherId) {
                DB::table('vouchers')
                    ->where('id', $voucherId)
                    ->increment('used_count');
            }

            $productIdsInOrder = [];
            foreach ($cart as $item) {
                DB::table('order_details')->insert([
                    'order_id'    => $orderId,
                    'product_id'  => $item['product_id'],
                    'product_attribute_id' => $item['product_attribute_id'] ?? null,
                    'size' => $item['size'] ?? null,
                    'quantity_detail' => $item['quantity_item'],
                    'total_detail' => $item['total_item'],
                ]);

                // Giảm số lượng trong products
                DB::table('products')->where('id', $item['product_id'])->decrement('quantity_product', $item['quantity_item']);
                
                // Giảm số lượng trong product_attributes nếu có
                if (!empty($item['product_attribute_id'])) {
                    DB::table('product_attributes')
                        ->where('id', $item['product_attribute_id'])
                        ->decrement('quantity', $item['quantity_item']);
                }
                
                // Lưu danh sách product_id đã được đặt hàng để xóa khỏi cart
                $productIdsInOrder[] = $item['product_id'];
            }

            // Xóa các sản phẩm đã được đặt hàng khỏi database cart
            if ($userId && !empty($productIdsInOrder)) {
                DB::table('carts')->where('user_id', $userId)
                    ->whereIn('product_id', $productIdsInOrder)
                    ->delete();
            }
            
            // Xóa các sản phẩm đã được đặt hàng khỏi session cart
            foreach ($productIdsInOrder as $productId) {
                if (isset($cart[$productId])) {
                    unset($cart[$productId]);
                }
            }
            session()->put('cart', $cart);

            DB::commit();

            // Clear cache top selling products và dashboard khi có order mới
            Cache::forget('top_selling_products');
            $this->clearDashboardCache();

            // Gửi email xác nhận đơn hàng
            try {
                $user = DB::table('users')->where('id', $userId)->first();
                if ($user && $user->email) {
                    // Lấy thông tin đơn hàng và sản phẩm để gửi email
                    $orderDetails = DB::table('order_details')
                        ->join('products', 'order_details.product_id', '=', 'products.id')
                        ->where('order_details.order_id', $orderId)
                        ->select(
                            'products.name_product',
                            'products.image_product',
                            'order_details.quantity_detail',
                            'order_details.total_detail',
                            'order_details.size'
                        )
                        ->get();
                    
                    // Chuẩn bị URL cho ảnh sản phẩm
                    $appUrl = config('app.url');
                    $orderDetailsWithUrl = $orderDetails->map(function($item) use ($appUrl) {
                        $item->image_url = $item->image_product ? $appUrl . '/' . $item->image_product : null;
                        return $item;
                    });
                    
                    $orderData = [
                        'order_code' => 'MDH_'.$orderId,
                        'order_id' => $orderId,
                        'name_customer' => $nameCustomer,
                        'phone_customer' => $phoneCustomer,
                        'address_customer' => $addressCustomer,
                        'date_order' => now()->format('d/m/Y H:i'),
                        'subtotal_order' => number_format($subtotalOrder, 0, ',', '.') . '₫',
                        'voucher_discount' => $voucherDiscount > 0 ? number_format($voucherDiscount, 0, ',', '.') . '₫' : '0₫',
                        'total_order' => number_format($totalOrder, 0, ',', '.') . '₫',
                        'method_pay' => $methodPay == 1 ? 'Thanh toán qua ngân hàng' : 'Thanh toán khi nhận hàng',
                        'products' => $orderDetailsWithUrl,
                        'app_url' => $appUrl
                    ];
                    
                    Mail::send('emails.order-confirmation', ['order' => $orderData], function ($message) use ($user, $orderData) {
                        $message->to($user->email, $user->name ?? $orderData['name_customer'])
                                ->subject('Xác nhận đơn hàng #' . $orderData['order_code']);
                    });
                }
            } catch (\Exception $emailError) {
                // Log lỗi email nhưng không làm gián đoạn quá trình đặt hàng
                \Log::error('Lỗi gửi email xác nhận đơn hàng: ' . $emailError->getMessage());
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Đặt hàng thành công',
                    'data' => [
                        'order_id' => $orderId,
                        'order_code' => 'MDH_'.$orderId
                    ]
                ], 201);
            }
            return back()->with('success', 'Đặt hàng thành công!');

        } catch (\Exception $e) {
            DB::rollBack();
            if ($request->expectsJson()) return response()->json(['status'=>'error', 'message'=>$e->getMessage()], 500);
            return back()->with('error', $e->getMessage());
        }
    }

    public function index(Request $request)
    {
        // Pagination cho API
        if ($request->expectsJson()) {
            $perPage = $request->input('per_page', 20);
            $page = $request->input('page', 1);
            $offset = ($page - 1) * $perPage;
            
            $total = DB::table('orders')->count();
            
            $orders = DB::table('orders')
                ->leftJoin('users', 'orders.user_id', '=', 'users.id')
                ->select('orders.*', 'users.name as user_name', 'users.email as user_email')
                ->orderByDesc('orders.date_order')
                ->offset($offset)
                ->limit($perPage)
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'orders' => $orders,
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
        $orders = DB::table('orders')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->select('orders.*', 'users.name as user_name', 'users.email as user_email')
            ->orderByDesc('orders.date_order')
            ->get();

        return view('admin.pages.order.index', compact('orders'));
    }

    public function show($id, Request $request)
    {
        $order = DB::table('orders')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->where('orders.id', $id)
            ->select('orders.*', 'users.name as user_name', 'users.email as user_email')
            ->first();
            
        if (!$order) {
            if($request->expectsJson()) return response()->json(['status'=>'error'], 404);
            abort(404);
        }
        $orderDetails = DB::table('order_details')
            ->leftJoin('products', 'order_details.product_id', '=', 'products.id')
            ->where('order_details.order_id', $id)
            ->select(
                'order_details.*', 
                'products.name_product',
                'products.image_product',
                'products.original_price',
                'products.discount_price',
                'products.discount_percent'
            )
            ->orderByDesc('order_details.id')
            ->get();

        if ($request->expectsJson()) return response()->json(['status'=>'success', 'data'=>['order'=>$order, 'details'=>$orderDetails]]);
        return view('admin.pages.order.show', compact('order', 'orderDetails'));
    }

    // Hàm cho User xem lịch sử
    public function indexUser(Request $request) {
        // Pagination cho API
        if ($request->expectsJson()) {
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            $offset = ($page - 1) * $perPage;
            
            $total = DB::table('orders')
                ->where('user_id', Auth::id())
                ->count();
            
            $orders = DB::table('orders')
                ->where('user_id', Auth::id())
                ->orderByDesc('date_order')
                ->offset($offset)
                ->limit($perPage)
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'orders' => $orders,
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
        $orders = DB::table('orders')
            ->where('user_id', Auth::id())
            ->orderByDesc('date_order')
            ->get();
            
        return view('user.pages.your-order', compact('orders'));
    }

    public function showUser($id) {
        $order = DB::table('orders')->where('id', $id)->where('user_id', Auth::id())->first();
        if (!$order) return response()->json(['status'=>'error'], 404);

        // Lấy thông tin đầy đủ của order_details bao gồm size, original_price, discount_price
        // Size được lưu trực tiếp trong order_details, không cần join với product_attributes
        $details = DB::table('order_details')
                      ->leftJoin('products', 'order_details.product_id', '=', 'products.id')
                      ->where('order_details.order_id', $id)
                      ->select(
                          'order_details.*',
                          'products.name_product',
                          'products.image_product',
                          'products.original_price',
                          'products.discount_price',
                          'products.discount_percent'
                      )
                      ->orderByDesc('order_details.id')
                      ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'order' => $order,
                'products' => $details
            ]
        ]);
    }

    // User cập nhật trạng thái đơn hàng (xác nhận hoặc hủy)
    public function updateUserOrderStatus(Request $request, $id) {
        $userId = Auth::id();
        
        // Hỗ trợ cả JSON và form-data
        $statusUserOrder = $request->input('status_user_order');
        $reasonUserOrder = $request->input('reason_user_order');
        
        if ($statusUserOrder === null && $request->isJson()) {
            $jsonData = $request->json()->all();
            $statusUserOrder = $jsonData['status_user_order'] ?? null;
            $reasonUserOrder = $jsonData['reason_user_order'] ?? null;
        }

        // Validation
        if ($statusUserOrder === null) {
            return response()->json([
                'status' => 'error',
                'message' => 'Trường status_user_order là bắt buộc. Giá trị hợp lệ: 0 (xác nhận), 1 (hủy)'
            ], 400);
        }

        // Chuyển đổi string thành số nếu cần
        $statusUserOrder = (int)$statusUserOrder;

        // Kiểm tra giá trị hợp lệ
        if (!in_array($statusUserOrder, [0, 1])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Giá trị status_user_order không hợp lệ. Chỉ chấp nhận: 0 (xác nhận), 1 (hủy)'
            ], 400);
        }

        // Nếu hủy đơn (status = 1) thì bắt buộc phải có lý do
        if ($statusUserOrder == 1 && empty($reasonUserOrder)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng nhập lý do hủy đơn hàng (reason_user_order)'
            ], 400);
        }
        
        // Kiểm tra đơn hàng thuộc về user đang đăng nhập
        $order = DB::table('orders')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy đơn hàng hoặc bạn không có quyền cập nhật đơn hàng này'
            ], 404);
        }

        // Kiểm tra đơn hàng đã được cập nhật trạng thái chưa
        // Chỉ kiểm tra nếu status_user_order không phải null
        if ($order->status_user_order !== null && $order->status_user_order == $statusUserOrder) {
            $statusText = $statusUserOrder == 0 ? 'xác nhận' : 'hủy';
            return response()->json([
                'status' => 'error',
                'message' => "Đơn hàng đã được {$statusText} trước đó"
            ], 400);
        }

        // Logic kiểm tra điều kiện
        if ($statusUserOrder == 0) {
            // Xác nhận đơn hàng (status_user_order = 0 = đã nhận hàng)
            // Chỉ xác nhận được khi status_delivery = 2 (đã giao hàng)
            if ($order->status_delivery != 2) {
                $deliveryStatusText = $order->status_delivery === null ? 'Chưa giao cho vận chuyển' : $this->getDeliveryStatusText($order->status_delivery);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Chỉ có thể xác nhận đơn hàng đã được giao hàng. Trạng thái giao hàng hiện tại: ' . $deliveryStatusText
                ], 400);
            }

            // Kiểm tra đơn hàng đã bị hủy chưa (status_user_order = 1)
            if ($order->status_user_order === 1) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không thể xác nhận đơn hàng đã bị hủy'
                ], 400);
            }

        } else {
            // Hủy đơn hàng (status_user_order = 1 = đã hủy)
            // Chỉ hủy được khi status_order = 0 (chờ xác nhận) hoặc 1 (đang xử lý)
            // Không hủy được khi status_order = 2 (đã giao cho bên vận chuyển)
            if ($order->status_order == 2) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không thể hủy đơn hàng đã được giao cho bên vận chuyển. Vui lòng liên hệ với cửa hàng để được hỗ trợ.'
                ], 400);
            }

            // Kiểm tra đơn hàng đã được xác nhận chưa (status_user_order = 0)
            if ($order->status_user_order === 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không thể hủy đơn hàng đã được xác nhận'
                ], 400);
            }
        }

        try {
            // Chuẩn bị dữ liệu cập nhật
            $updateData = [
                'status_user_order' => $statusUserOrder,
            ];

            // Nếu xác nhận (status = 0), xóa lý do hủy
            // Nếu hủy (status = 1), lưu lý do hủy
            if ($statusUserOrder == 0) {
                $updateData['reason_user_order'] = null;
            } else {
                $updateData['reason_user_order'] = $reasonUserOrder;
            }

            // Cập nhật đơn hàng
            DB::table('orders')
                ->where('id', $id)
                ->where('user_id', $userId)
                ->update($updateData);

            // Clear dashboard cache khi user order status thay đổi
            $this->clearDashboardCache();

            $statusText = $statusUserOrder == 0 ? 'Đã nhận đơn' : 'Đã hủy';
            $message = $statusUserOrder == 0 ? 'Xác nhận đơn hàng thành công' : 'Hủy đơn hàng thành công';

            return response()->json([
                'status' => 'success',
                'message' => $message,
                'data' => [
                    'order_id' => $id,
                    'order_code' => 'MDH_' . $id,
                    'status_user_order' => $statusUserOrder,
                    'reason_user_order' => $statusUserOrder == 1 ? $reasonUserOrder : null,
                    'status_text' => $statusText
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng: ' . $e->getMessage()
            ], 500);
        }
    }

    // Helper function để lấy text trạng thái giao hàng
    private function getDeliveryStatusText($status) {
        $statusMap = [
            0 => 'Đã nhận hàng',
            1 => 'Đang giao hàng',
            2 => 'Đã giao hàng'
        ];
        return $statusMap[$status] ?? 'Không xác định';
    }

    // Helper function để lấy text trạng thái đơn hàng
    private function getOrderStatusText($status) {
        $statusMap = [
            0 => 'Chờ xác nhận',
            1 => 'Đang xử lý',
            2 => 'Đã giao cho bên vận chuyển'
        ];
        return $statusMap[$status] ?? 'Không xác định';
    }

    // Helper function để clear dashboard cache
    private function clearDashboardCache() {
        // Clear các cache key dashboard (sử dụng pattern matching)
        // Vì Laravel cache driver có thể không hỗ trợ pattern, ta clear các key phổ biến
        $today = Carbon::now()->toDateString();
        $yesterday = Carbon::now()->subDay()->toDateString();
        $thisMonth = Carbon::now()->format('Y-m');
        $thisYear = Carbon::now()->year;
        
        // Clear cache cho các period phổ biến
        $periods = ['day', 'month', 'year'];
        foreach ($periods as $period) {
            Cache::forget('dashboard_total_orders_' . $today . '_' . $period);
            Cache::forget('dashboard_total_orders_' . $yesterday . '_' . $period);
            Cache::forget('dashboard_total_revenue_' . $today . '_' . $period);
            Cache::forget('dashboard_total_revenue_' . $yesterday . '_' . $period);
            Cache::forget('dashboard_top_products_' . $today . '_' . $period);
            Cache::forget('dashboard_top_products_' . $yesterday . '_' . $period);
        }
        
        // Clear cache cho tháng và năm hiện tại
        Cache::forget('dashboard_total_orders_' . $thisMonth . '_month');
        Cache::forget('dashboard_total_revenue_' . $thisMonth . '_month');
        Cache::forget('dashboard_top_products_' . $thisMonth . '_month');
        Cache::forget('dashboard_total_orders_' . $thisYear . '_year');
        Cache::forget('dashboard_total_revenue_' . $thisYear . '_year');
        Cache::forget('dashboard_top_products_' . $thisYear . '_year');
    }

    // Update status methods for Admin
    public function updateStatus(Request $request, $orderId) {
        // Hỗ trợ cả status_order và status (tên field mới)
        $statusOrder = $request->input('status_order') ?? $request->input('status');
        
        // Kiểm tra nếu là JSON request và không có trong input, thử lấy từ json()
        if ($statusOrder === null && $request->isJson()) {
            $jsonData = $request->json()->all();
            $statusOrder = $jsonData['status_order'] ?? $jsonData['status'] ?? null;
        }
        
        // Convert string values thành số
        if (is_string($statusOrder)) {
            $statusMap = [
                'pending' => 0,
                'processing' => 1,
                'completed' => 2,
                'confirmed' => 2,
                'done' => 2
            ];
            $statusOrder = $statusMap[strtolower($statusOrder)] ?? null;
        }
        
        if ($statusOrder === null || $statusOrder === '') {
            if ($request->expectsJson()) {
                return response()->json([
                    'status'=>'error', 
                    'message'=>'Trạng thái đơn hàng không được để trống. Giá trị hợp lệ: 0 (pending), 1 (processing), 2 (completed/confirmed)',
                    'debug' => [
                        'received_data' => $request->all(),
                        'content_type' => $request->header('Content-Type'),
                        'method' => $request->method()
                    ]
                ], 400);
            }
            return redirect()->route('admin.order.index')->with('error', 'Trạng thái đơn hàng không được để trống');
        }

        try {
            DB::table('orders')->where('id', $orderId)->update(['status_order' => (int)$statusOrder]);
            
            // Clear dashboard cache khi status order thay đổi
            $this->clearDashboardCache();
            
            if ($request->expectsJson()) return response()->json(['status'=>'success']);
            return redirect()->route('admin.order.index')->with('success', 'Cập nhật trạng thái thành công');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json(['status'=>'error', 'message'=>$e->getMessage()], 500);
            }
            return redirect()->route('admin.order.index')->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
        }
    }

    public function updateDeliveryStatus(Request $request, $orderId) {
        // Hỗ trợ cả status_delivery và delivery_status (tên field mới)
        $statusDelivery = $request->input('status_delivery') ?? $request->input('delivery_status');
        
        // Kiểm tra nếu là JSON request và không có trong input, thử lấy từ json()
        if ($statusDelivery === null && $request->isJson()) {
            $jsonData = $request->json()->all();
            $statusDelivery = $jsonData['status_delivery'] ?? $jsonData['delivery_status'] ?? null;
        }
        
        // Convert string values thành số
        if (is_string($statusDelivery)) {
            $deliveryMap = [
                'preparing' => 0,
                'prepared' => 0,
                'shipping' => 1,
                'delivering' => 1,
                'delivered' => 2,
                'completed' => 2
            ];
            $statusDelivery = $deliveryMap[strtolower($statusDelivery)] ?? null;
        }
        
        if ($statusDelivery === null || $statusDelivery === '') {
            if ($request->expectsJson()) {
                return response()->json([
                    'status'=>'error', 
                    'message'=>'Trạng thái giao hàng không được để trống. Giá trị hợp lệ: 0 (preparing), 1 (shipping), 2 (delivered)',
                    'debug' => [
                        'received_data' => $request->all(),
                        'content_type' => $request->header('Content-Type'),
                        'method' => $request->method()
                    ]
                ], 400);
            }
            return redirect()->route('admin.order.index')->with('error', 'Trạng thái giao hàng không được để trống');
        }

        try {
            DB::table('orders')->where('id', $orderId)->update(['status_delivery' => (int)$statusDelivery]);
            
            // Clear dashboard cache khi delivery status thay đổi
            $this->clearDashboardCache();
            
            if ($request->expectsJson()) return response()->json(['status'=>'success']);
            return redirect()->route('admin.order.index')->with('success', 'Cập nhật trạng thái giao hàng thành công');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json(['status'=>'error', 'message'=>$e->getMessage()], 500);
            }
            return redirect()->route('admin.order.index')->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng thống nhất (gộp status_order và status_delivery)
     * unified_status: 0=Chờ xác nhận, 1=Đang xử lý, 2=Đã giao cho vận chuyển, 
     *                 3=Đã nhận hàng từ kho, 4=Đang giao hàng, 5=Đã giao hàng
     */
    public function updateUnifiedStatus(Request $request, $orderId) {
        $unifiedStatus = $request->input('unified_status') ?? $request->input('status');
        
        // Kiểm tra nếu là JSON request
        if ($unifiedStatus === null && $request->isJson()) {
            $jsonData = $request->json()->all();
            $unifiedStatus = $jsonData['unified_status'] ?? $jsonData['status'] ?? null;
        }
        
        if ($unifiedStatus === null || $unifiedStatus === '') {
            return response()->json([
                'status'=>'error', 
                'message'=>'Trạng thái không được để trống. Giá trị hợp lệ: 0-5'
            ], 400);
        }

        $unifiedStatus = (int)$unifiedStatus;
        
        if ($unifiedStatus < 0 || $unifiedStatus > 5) {
            return response()->json([
                'status'=>'error', 
                'message'=>'Trạng thái không hợp lệ. Giá trị hợp lệ: 0-5'
            ], 400);
        }

        try {
            DB::beginTransaction();
            
            // Kiểm tra đơn hàng có tồn tại không
            $order = DB::table('orders')->where('id', $orderId)->first();
            if (!$order) {
                return response()->json([
                    'status'=>'error', 
                    'message'=>'Không tìm thấy đơn hàng'
                ], 404);
            }

            // Kiểm tra đơn hàng đã bị hủy chưa
            if ($order->status_user_order === 1) {
                return response()->json([
                    'status'=>'error', 
                    'message'=>'Không thể cập nhật trạng thái đơn hàng đã bị hủy'
                ], 400);
            }

            // Cập nhật theo unified status
            if ($unifiedStatus >= 3) {
                // Các trạng thái giao hàng: cần set status_order = 2 trước
                $deliveryStatus = $unifiedStatus - 2;
                DB::table('orders')->where('id', $orderId)->update([
                    'status_order' => 2,
                    'status_delivery' => $deliveryStatus
                ]);
            } else {
                // Các trạng thái đơn hàng: 0, 1, 2
                DB::table('orders')->where('id', $orderId)->update([
                    'status_order' => $unifiedStatus,
                    'status_delivery' => $unifiedStatus < 2 ? null : $order->status_delivery
                ]);
            }
            
            DB::commit();
            
            // Clear dashboard cache
            $this->clearDashboardCache();
            
            return response()->json([
                'status'=>'success',
                'message'=>'Cập nhật trạng thái thành công'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'=>'error', 
                'message'=>'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}
