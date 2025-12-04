<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class ReviewController extends Controller
{
    /**
     * Lấy danh sách tất cả đánh giá (Admin)
     */
    public function index(Request $request)
    {
        try {
            // Pagination cho API
            if ($request->expectsJson()) {
                $perPage = $request->input('per_page', 20);
                $page = $request->input('page', 1);
                $offset = ($page - 1) * $perPage;
                
                $query = DB::table('reviews')
                    ->join('users', 'reviews.user_id', '=', 'users.id')
                    ->join('products', 'reviews.product_id', '=', 'products.id')
                    ->select(
                        'reviews.id',
                        'reviews.user_id',
                        'reviews.product_id',
                        'reviews.rating',
                        'reviews.content',
                        'reviews.admin_reply',
                        'reviews.status',
                        'reviews.admin_replied_at',
                        'reviews.created_at',
                        'reviews.updated_at',
                        'users.name as user_name',
                        'users.email as user_email',
                        'products.name_product as product_name',
                        'products.image_product as product_image'
                    );

                // Tìm kiếm
                if ($request->has('search') && $request->search) {
                    $search = $request->search;
                    $query->where(function($q) use ($search) {
                        $q->where('users.name', 'like', "%{$search}%")
                          ->orWhere('users.email', 'like', "%{$search}%")
                          ->orWhere('products.name_product', 'like', "%{$search}%")
                          ->orWhere('reviews.content', 'like', "%{$search}%");
                    });
                }

                // Lọc theo rating
                if ($request->has('rating') && $request->rating) {
                    $query->where('reviews.rating', $request->rating);
                }

                // Lọc theo status (0: Ẩn, 1: Hiển thị)
                if ($request->has('status') && $request->status !== null && $request->status !== '') {
                    $query->where('reviews.status', $request->status);
                }

                // Lọc theo sản phẩm
                if ($request->has('product_id') && $request->product_id) {
                    $query->where('reviews.product_id', $request->product_id);
                }

                $total = $query->count();
                
                $reviews = $query->orderByDesc('reviews.created_at')
                    ->offset($offset)
                    ->limit($perPage)
                    ->get();
                
                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'reviews' => $reviews,
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
            $reviews = DB::table('reviews')
                ->join('users', 'reviews.user_id', '=', 'users.id')
                ->join('products', 'reviews.product_id', '=', 'products.id')
                ->select(
                    'reviews.id',
                    'reviews.user_id',
                    'reviews.product_id',
                    'reviews.rating',
                    'reviews.content',
                    'reviews.admin_reply',
                    'reviews.status',
                    'reviews.admin_replied_at',
                    'reviews.created_at',
                    'users.name as user_name',
                    'users.email as user_email',
                    'products.name_product as product_name'
                )
                ->orderByDesc('reviews.created_at')
                ->get();

            return view('admin.pages.reviews.index', compact('reviews'));
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể tải danh sách đánh giá: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem chi tiết một đánh giá
     */
    public function show($id, Request $request)
    {
        try {
            $review = DB::table('reviews')
                ->join('users', 'reviews.user_id', '=', 'users.id')
                ->join('products', 'reviews.product_id', '=', 'products.id')
                ->select(
                    'reviews.id',
                    'reviews.user_id',
                    'reviews.product_id',
                    'reviews.rating',
                    'reviews.content',
                    'reviews.admin_reply',
                    'reviews.status',
                    'reviews.admin_replied_at',
                    'reviews.created_at',
                    'reviews.updated_at',
                    'users.name as user_name',
                    'users.email as user_email',
                    'products.name_product as product_name',
                    'products.image_product as product_image'
                )
                ->where('reviews.id', $id)
                ->first();

            if (!$review) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy đánh giá'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $review
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể tải đánh giá: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ẩn/Hiện đánh giá (Admin - không xóa, chỉ ẩn)
     */
    public function toggleStatus($id, Request $request)
    {
        try {
            $review = DB::table('reviews')->where('id', $id)->first();
            
            if (!$review) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy đánh giá'
                ], 404);
            }

            $newStatus = $review->status == 1 ? 0 : 1;
            
            DB::table('reviews')
                ->where('id', $id)
                ->update([
                    'status' => $newStatus,
                    'updated_at' => now()
                ]);
            
            // Clear cache nếu có
            Cache::forget('product_reviews_' . $review->product_id);
            
            return response()->json([
                'status' => 'success',
                'message' => $newStatus == 1 ? 'Đã hiển thị đánh giá' : 'Đã ẩn đánh giá',
                'data' => ['status' => $newStatus]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thay đổi trạng thái đánh giá: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin trả lời đánh giá
     */
    public function reply($id, Request $request)
    {
        try {
            $adminReply = $request->input('admin_reply');
            
            if (!$adminReply || trim($adminReply) === '') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vui lòng nhập nội dung phản hồi'
                ], 400);
            }

            $review = DB::table('reviews')->where('id', $id)->first();
            
            if (!$review) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy đánh giá'
                ], 404);
            }

            DB::table('reviews')
                ->where('id', $id)
                ->update([
                    'admin_reply' => trim($adminReply),
                    'admin_replied_at' => now(),
                    'updated_at' => now()
                ]);
            
            // Clear cache nếu có
            Cache::forget('product_reviews_' . $review->product_id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Đã thêm phản hồi thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thêm phản hồi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa đánh giá (Admin có quyền xóa bất kỳ) - Giữ lại để tương thích
     */
    public function destroy($id, Request $request)
    {
        try {
            $review = DB::table('reviews')->where('id', $id)->first();
            
            if (!$review) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy đánh giá'
                ], 404);
            }

            DB::table('reviews')->where('id', $id)->delete();
            
            // Clear cache nếu có
            Cache::forget('product_reviews_' . $review->product_id);
            
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Đã xóa đánh giá thành công'
                ]);
            }
            
            return redirect()->route('admin.reviews.index')->with('success', 'Đã xóa đánh giá');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không thể xóa đánh giá: ' . $e->getMessage()
                ], 500);
            }
            
            return back()->with('error', 'Có lỗi xảy ra khi xóa đánh giá');
        }
    }

    /**
     * Lấy thống kê đánh giá
     */
    public function statistics(Request $request)
    {
        try {
            $totalReviews = DB::table('reviews')->where('status', 1)->count();
            $avgRating = DB::table('reviews')->where('status', 1)->avg('rating');
            
            $ratingDistribution = DB::table('reviews')
                ->where('status', 1)
                ->select('rating', DB::raw('count(*) as count'))
                ->groupBy('rating')
                ->orderBy('rating', 'desc')
                ->get();

            $recentReviews = DB::table('reviews')
                ->join('users', 'reviews.user_id', '=', 'users.id')
                ->join('products', 'reviews.product_id', '=', 'products.id')
                ->select(
                    'reviews.id',
                    'reviews.rating',
                    'reviews.content',
                    'reviews.status',
                    'reviews.created_at',
                    'users.name as user_name',
                    'products.name_product as product_name'
                )
                ->orderByDesc('reviews.created_at')
                ->limit(10)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_reviews' => $totalReviews,
                    'average_rating' => round($avgRating, 2),
                    'rating_distribution' => $ratingDistribution,
                    'recent_reviews' => $recentReviews
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể tải thống kê: ' . $e->getMessage()
            ], 500);
        }
    }
}

