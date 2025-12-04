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
                ->select(
                    'reviews.id',
                    'reviews.rating',
                    'reviews.content',
                    'reviews.created_at',
                    'users.name as user_name',
                    'users.email as user_email'
                )
                ->orderBy('reviews.created_at', 'desc')
                ->get();

            // Tính toán rating trung bình
            $avgRating = DB::table('reviews')
                ->where('product_id', $productId)
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

            // Kiểm tra đã đánh giá chưa
            $existing = DB::table('reviews')
                ->where('user_id', $userId)
                ->where('product_id', $productId)
                ->first();

            if ($existing) {
                // Cho phép cập nhật đánh giá cũ
                DB::table('reviews')
                    ->where('id', $existing->id)
                    ->update([
                        'rating' => $rating,
                        'content' => $content,
                        'updated_at' => now()
                    ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Đã cập nhật đánh giá',
                    'data' => ['id' => $existing->id]
                ]);
            }

            // Tạo đánh giá mới
            $reviewId = DB::table('reviews')->insertGetId([
                'user_id' => $userId,
                'product_id' => $productId,
                'rating' => $rating,
                'content' => $content,
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

