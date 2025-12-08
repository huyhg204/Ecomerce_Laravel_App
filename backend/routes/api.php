<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\user\HomeController;
use App\Http\Controllers\user\CartController;
use App\Http\Controllers\user\OrderController;
use App\Http\Controllers\user\WishlistController;
use App\Http\Controllers\user\ReviewController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\admin\RevenueController;
use App\Http\Controllers\admin\ReviewController as AdminReviewController;
use App\Http\Controllers\admin\VoucherController;
use App\Http\Controllers\admin\BannerController;
use App\Http\Middleware\checkRoleUser;
use App\Http\Middleware\checkRoleAdmin;
use App\Http\Middleware\CorsMiddleware; // Đảm bảo đã import Cors

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --------------------------------------------------------------------------
// PUBLIC ROUTES (Không cần Token)
// --------------------------------------------------------------------------
// Áp dụng CORS middleware cho public routes để React gọi không bị chặn
Route::middleware([CorsMiddleware::class])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOTP']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::get('/home', [HomeController::class, 'index']);
    Route::get('/categories', [CategoryController::class, 'index']); // Lấy danh mục public
    Route::get('/products', [ProductController::class, 'index']);    // Lấy sản phẩm public
    Route::get('/product/{id}', [HomeController::class, 'productDetail']);
    Route::get('/category/{id}', [HomeController::class, 'showProductsByCategory']);
    Route::post('/search', [HomeController::class, 'showProductsBySearch']);
    Route::post('/chat', [ChatController::class, 'chat']);
    Route::post('/search-order', [OrderController::class, 'searchOrder']);
    
    // Public Reviews - Xem đánh giá sản phẩm (không cần đăng nhập)
    Route::get('/product/{id}/reviews', [ReviewController::class, 'index']);
    
    // Voucher - Validate voucher (public)
    Route::post('/voucher/validate', [VoucherController::class, 'validateVoucher']);
    
    // Banners - Lấy banner public (cho frontend)
    Route::get('/banners', [BannerController::class, 'index']);
});

// --------------------------------------------------------------------------
// PROTECTED ROUTES (Cần Token "Bearer" - Auth Sanctum)
// --------------------------------------------------------------------------
// QUAN TRỌNG: Thay 'web' bằng 'auth:sanctum' để dùng Token
Route::middleware(['auth:sanctum', CorsMiddleware::class])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/update-profile', [AuthController::class, 'updateProfile']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Cart & Checkout
    Route::get('/cart', [CartController::class, 'cart']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::post('/cart/remove', [CartController::class, 'removeFromCart']);
    Route::post('/checkout', [OrderController::class, 'createOrder']);

    // MoMo Payment
    Route::post('/momo_payment', [OrderController::class, 'momo_payment']);

    // ----------------------------------------------------------------------
    // USER ROUTES (Role = 0)
    // ----------------------------------------------------------------------
    // Token đã check ở ngoài, checkRoleUser chỉ check quyền
    Route::middleware([checkRoleUser::class])->prefix('user')->group(function() {
         Route::get('/orders', [OrderController::class, 'indexUser']);
         Route::get('/orders/{id}', [OrderController::class, 'showUser']);
         Route::put('/orders/{id}/status', [OrderController::class, 'updateUserOrderStatus']);
         
         // Wishlist Routes
         Route::get('/wishlist', [WishlistController::class, 'index']);
         Route::post('/wishlist', [WishlistController::class, 'store']);
         Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);
         Route::post('/wishlist/remove', [WishlistController::class, 'removeByProduct']);
         Route::get('/wishlist/check/{productId}', [WishlistController::class, 'check']);
         
         // Review Routes
         Route::post('/reviews', [ReviewController::class, 'store']);
         Route::put('/reviews/{id}', [ReviewController::class, 'update']);
         Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    });

    // ----------------------------------------------------------------------
    // ADMIN ROUTES (Role = 1)
    // ----------------------------------------------------------------------
    // Token đã check ở ngoài, checkRoleAdmin chỉ check quyền
    Route::middleware([checkRoleAdmin::class])->prefix('admin')->group(function() {

        // Products
        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/{id}', [ProductController::class, 'edit']); // Lấy thông tin sản phẩm để edit
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::post('/products/{id}', [ProductController::class, 'update']); // Hỗ trợ POST với _method=PUT cho FormData
        Route::delete('/products/{id}', [ProductController::class, 'destroy']); // Xóa mềm (ẩn)
        Route::put('/products/{id}/restore', [ProductController::class, 'restore']); // Khôi phục (hiện)

        // Categories
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::post('/categories/{id}', [CategoryController::class, 'update']); // Hỗ trợ POST với _method=PUT cho FormData
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']); // Xóa mềm (ẩn)
        Route::put('/categories/{id}/restore', [CategoryController::class, 'restore']); // Khôi phục (hiện)

        // Users
        Route::get('/users', [UserController::class, 'index']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::put('/users/{id}/restore', [UserController::class, 'restore']);

        // Orders
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
        Route::put('/orders/{id}/delivery-status', [OrderController::class, 'updateDeliveryStatus']);
        Route::put('/orders/{id}/unified-status', [OrderController::class, 'updateUnifiedStatus']); // API thống nhất

        // Revenue
        Route::get('/revenue', [RevenueController::class, 'index']);
        Route::get('/revenue/last-7-days', [RevenueController::class, 'getLast7DaysStats']);

        // Reviews
        Route::get('/reviews', [AdminReviewController::class, 'index']);
        Route::get('/reviews/{id}', [AdminReviewController::class, 'show']);
        Route::post('/reviews/{id}/reply', [AdminReviewController::class, 'reply']); // Admin trả lời đánh giá
        Route::put('/reviews/{id}/toggle-status', [AdminReviewController::class, 'toggleStatus']); // Ẩn/Hiện đánh giá
        Route::post('/reviews/{id}/toggle-status', [AdminReviewController::class, 'toggleStatus']); // Hỗ trợ POST với _method=PUT
        Route::delete('/reviews/{id}', [AdminReviewController::class, 'destroy']);
        Route::get('/reviews-statistics', [AdminReviewController::class, 'statistics']);

        // Vouchers
        Route::get('/vouchers', [VoucherController::class, 'index']);
        Route::post('/vouchers', [VoucherController::class, 'store']);
        Route::get('/vouchers/{id}', [VoucherController::class, 'show']);
        Route::put('/vouchers/{id}', [VoucherController::class, 'update']);
        Route::post('/vouchers/{id}', [VoucherController::class, 'update']); // Hỗ trợ POST với _method=PUT
        Route::delete('/vouchers/{id}', [VoucherController::class, 'destroy']);

        // Banners
        Route::get('/banners', [BannerController::class, 'index']);
        Route::post('/banners', [BannerController::class, 'store']);
        Route::get('/banners/{id}', [BannerController::class, 'show']);
        Route::put('/banners/{id}', [BannerController::class, 'update']);
        Route::post('/banners/{id}', [BannerController::class, 'update']); // Hỗ trợ POST với _method=PUT
        Route::delete('/banners/{id}', [BannerController::class, 'destroy']);
    });
});
