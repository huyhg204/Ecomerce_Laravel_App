<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WishlistController extends Controller
{
    /**
     * Lấy danh sách wishlist của user
     */
    public function index(Request $request)
    {
        try {
            $userId = Auth::id();
            
            $wishlistItems = DB::table('wishlists')
                ->join('products', 'wishlists.product_id', '=', 'products.id')
                ->where('wishlists.user_id', $userId)
                ->where('products.status_product', 0) // Chỉ lấy sản phẩm đang active
                ->select(
                    'wishlists.id',
                    'wishlists.product_id',
                    'wishlists.created_at',
                    'products.name_product',
                    'products.image_product',
                    'products.price_product',
                    'products.quantity_product',
                    'products.description_product'
                )
                ->orderBy('wishlists.created_at', 'desc')
                ->get();

            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'data' => $wishlistItems
                ]);
            }

            return view('user.pages.wishlist', compact('wishlistItems'));
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không thể tải danh sách yêu thích: ' . $e->getMessage()
                ], 500);
            }
            return back()->with('error', 'Có lỗi xảy ra');
        }
    }

    /**
     * Thêm sản phẩm vào wishlist
     */
    public function store(Request $request)
    {
        try {
            $userId = Auth::id();
            $productId = $request->input('product_id');

            if (!$productId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vui lòng cung cấp product_id'
                ], 400);
            }

            // Kiểm tra sản phẩm có tồn tại và đang active không
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

            // Kiểm tra đã có trong wishlist chưa
            $existing = DB::table('wishlists')
                ->where('user_id', $userId)
                ->where('product_id', $productId)
                ->first();

            if ($existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Sản phẩm đã có trong danh sách yêu thích'
                ], 400);
            }

            // Thêm vào wishlist
            $wishlistId = DB::table('wishlists')->insertGetId([
                'user_id' => $userId,
                'product_id' => $productId,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Đã thêm vào danh sách yêu thích',
                'data' => ['id' => $wishlistId]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thêm vào danh sách yêu thích: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa sản phẩm khỏi wishlist
     */
    public function destroy($id, Request $request)
    {
        try {
            $userId = Auth::id();

            // Xóa theo wishlist id
            $deleted = DB::table('wishlists')
                ->where('id', $id)
                ->where('user_id', $userId)
                ->delete();

            if ($deleted) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Đã xóa khỏi danh sách yêu thích'
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy sản phẩm trong danh sách yêu thích'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xóa: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa sản phẩm khỏi wishlist theo product_id
     */
    public function removeByProduct(Request $request)
    {
        try {
            $userId = Auth::id();
            $productId = $request->input('product_id');

            if (!$productId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vui lòng cung cấp product_id'
                ], 400);
            }

            $deleted = DB::table('wishlists')
                ->where('user_id', $userId)
                ->where('product_id', $productId)
                ->delete();

            if ($deleted) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Đã xóa khỏi danh sách yêu thích'
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy sản phẩm trong danh sách yêu thích'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể xóa: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Kiểm tra sản phẩm có trong wishlist không
     */
    public function check($productId, Request $request)
    {
        try {
            $userId = Auth::id();

            $exists = DB::table('wishlists')
                ->where('user_id', $userId)
                ->where('product_id', $productId)
                ->exists();

            return response()->json([
                'status' => 'success',
                'data' => ['is_in_wishlist' => $exists]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể kiểm tra: ' . $e->getMessage()
            ], 500);
        }
    }
}

