<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Lấy danh sách đánh giá của sản phẩm
     */
    public function index($productId, Request $request)
    {
        try {
            $reviews = DB::table('reviews')
                ->join('users', 'reviews.user_id', '=', 'users.id')
                ->where('reviews.product_id', $productId)
                ->where('reviews.status', 1) // Chỉ lấy đánh giá đang hiển thị
                ->when($request->has('order_id'), function ($query) use ($request) {
                    $orderId = $request->input('order_id');
                    // Nếu có token, chỉ trả về review của chính user cho order này (hoặc review cũ chưa gắn order_id)
                    if (Auth::check()) {
                        $query->where('reviews.user_id', Auth::id());
                    }
                    return $query->where(function($q) use ($orderId) {
                        $q->where('reviews.order_id', $orderId)
                          ->orWhereNull('reviews.order_id'); // dữ liệu cũ chưa có order_id vẫn hiển thị
                    });
                })
                ->select(
                    'reviews.id',
                    'reviews.rating',
                    'reviews.content',
                    'reviews.admin_reply',
                    'reviews.status',
                    'reviews.admin_replied_at',
                    'reviews.created_at',
                    'reviews.user_id',
                    'reviews.order_id',
                    'users.name as user_name',
                    'users.email as user_email'
                )
                ->orderBy('reviews.created_at', 'desc')
                ->get();

            // Tính toán rating trung bình (chỉ tính đánh giá đang hiển thị)
            $avgRating = DB::table('reviews')
                ->where('product_id', $productId)
                ->where('status', 1)
                ->avg('rating');

            $totalReviews = $reviews->count();

            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'reviews' => $reviews,
                        'average_rating' => round($avgRating, 1),
                        'total_reviews' => $totalReviews
                    ]
                ]);
            }

            return view('user.pages.product-reviews', compact('reviews', 'avgRating', 'totalReviews'));
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không thể tải đánh giá: ' . $e->getMessage()
                ], 500);
            }
            return back()->with('error', 'Có lỗi xảy ra');
        }
    }

    /**
     * Tạo đánh giá mới
     */
    public function store(Request $request)
    {
        try {
            $userId = Auth::id();
            $productId = $request->input('product_id');
            $orderId = $request->input('order_id');
            $rating = $request->input('rating');
            $content = $request->input('content');

            // Validation
            if (!$productId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vui lòng cung cấp product_id'
                ], 400);
            }

            if (!$rating || $rating < 1 || $rating > 5) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Rating phải từ 1 đến 5 sao'
                ], 400);
            }

            // Kiểm tra sản phẩm có tồn tại không
            $product = DB::table('products')
                ->where('id', $productId)
                ->where('status_product', 0)
                ->first();

            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Sản phẩm không tồn tại hoặc đã bị ẩn'
                ], 404);
            }

            // Chỉ cho phép đánh giá khi user đã mua và nhận sản phẩm
            $hasPurchased = DB::table('orders')
                ->join('order_details', 'orders.id', '=', 'order_details.order_id')
                ->where('orders.user_id', $userId)
                ->where('order_details.product_id', $productId)
                ->where(function ($query) {
                    // Đơn đã giao hoặc user đã xác nhận đã nhận hàng
                    $query->where('orders.status_delivery', 2)
                        ->orWhere('orders.status_user_order', 0);
                })
                ->where(function ($query) {
                    // Không áp dụng cho đơn đã bị hủy
                    $query->whereNull('orders.status_user_order')
                        ->orWhere('orders.status_user_order', '!=', 1);
                })
                ->exists();

            if (!$hasPurchased) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Bạn chỉ có thể đánh giá sau khi đã mua và nhận sản phẩm này'
                ], 403);
            }

            // Nếu truyền order_id, xác thực order thuộc user và chứa sản phẩm
            if ($orderId) {
                $orderHasProduct = DB::table('orders')
                    ->join('order_details', 'orders.id', '=', 'order_details.order_id')
                    ->where('orders.id', $orderId)
                    ->where('orders.user_id', $userId)
                    ->where('order_details.product_id', $productId)
                    ->exists();
                if (!$orderHasProduct) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Đơn hàng không hợp lệ cho sản phẩm này'
                    ], 400);
                }
            }

            // Cho phép user đánh giá nhiều lần - không kiểm tra đánh giá cũ
            $reviewId = DB::table('reviews')->insertGetId([
                'user_id' => $userId,
                'product_id' => $productId,
                'order_id' => $orderId,
                'rating' => $rating,
                'content' => $content,
                'status' => 1, // Mặc định hiển thị
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Đã thêm đánh giá',
                'data' => ['id' => $reviewId]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thêm đánh giá: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật đánh giá
     */
    public function update($id, Request $request)
    {
        try {
            $userId = Auth::id();
            $rating = $request->input('rating');
            $content = $request->input('content');

            if ($rating && ($rating < 1 || $rating > 5)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Rating phải từ 1 đến 5 sao'
                ], 400);
            }

            $review = DB::table('reviews')
                ->where('id', $id)
                ->where('user_id', $userId)
                ->first();

            if (!$review) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy đánh giá'
                ], 404);
            }

            $updateData = ['updated_at' => now()];
            if ($rating) $updateData['rating'] = $rating;
            if ($content !== null) $updateData['content'] = $content;

            DB::table('reviews')
                ->where('id', $id)
                ->update($updateData);

            return response()->json([
                'status' => 'success',
                'message' => 'Đã cập nhật đánh giá'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể cập nhật đánh giá: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa đánh giá
     */
    public function destroy($id, Request $request)
    {
        try {
            $userId = Auth::id();

            $deleted = DB::table('reviews')
                ->where('id', $id)
                ->where('user_id', $userId)
                ->delete();

            if ($deleted) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Đã xóa đánh giá'
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy đánh giá'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xóa đánh giá: ' . $e->getMessage()
            ], 500);
        }
    }
}

