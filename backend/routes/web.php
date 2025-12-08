<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\user\HomeController;
use App\Http\Controllers\user\CartController;
use App\Http\Controllers\user\OrderController;

use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\RevenueController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\ChatController;

use App\Http\Middleware\checkRoleAdmin;
use App\Http\Middleware\checkRoleUser;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Http\Middleware\RedirectIfNotAuthenticated;
use App\Http\Middleware\CorsMiddleware;
use Illuminate\Support\Facades\Auth;

//guest can access

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/search-order', [OrderController::class, 'showSearchOrderView'])->name('showSearchOrderView');
Route::get('/product/{id}', [HomeController::class, 'productDetail']);
Route::get('/category/{id}', [HomeController::class, 'showProductsByCategory']);
Route::post('/search', [HomeController::class, 'showProductsBySearch'])->name('showProductsBySearch');
Route::get('/ai-staff', [HomeController::class, 'showAiStaff'])->name('showAiStaff');
Route::middleware([CorsMiddleware::class])->post('/chat', [ChatController::class, 'chat']);

Route::get('/cart', [CartController::class, 'cart']);
Route::post('/cart', [OrderController::class, 'createOrder']);
Route::post('/cart/add', [CartController::class, 'addToCart'])->name('addToCart');
Route::post('/cart/remove', [CartController::class, 'removeFromCart'])->name('removeFromCart');

// MoMo Payment Routes
Route::post('/momo_payment', [OrderController::class, 'momo_payment'])->name('momo.payment');
Route::get('/momo-callback', [OrderController::class, 'momo_callback'])->name('momo.callback');
Route::post('/momo-callback', [OrderController::class, 'momo_callback'])->name('momo.callback.post');


Route::middleware([checkRoleUser::class])->prefix('user/orders')->name('user.orders.')->group(function() {
    Route::get('/', [OrderController::class, 'indexUser'])->name('index');
});


//cant access after login
Route::middleware([RedirectIfAuthenticated::class])->group(function () {
    Route::get('/auth', [AuthController::class, 'showAuthForm'])->name('auth');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    });

//only access after login
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware([RedirectIfNotAuthenticated::class]);



Route::prefix('admin/category')->name('admin.category.')->middleware([checkRoleAdmin::class])->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->name('index');
    Route::get('/create', [CategoryController::class, 'create'])->name('create');
    Route::post('/store', [CategoryController::class, 'store'])->name('store');
    Route::get('/edit/{id}', [CategoryController::class, 'edit'])->name('edit');
    Route::post('/update/{id}', [CategoryController::class, 'update'])->name('update');
    Route::get('/delete/{id}', [CategoryController::class, 'destroy'])->name('destroy');
    Route::get('/restore/{id}', [CategoryController::class, 'restore'])->name('restore');
});


Route::prefix('admin/product')->name('admin.product.')->middleware([checkRoleAdmin::class])->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('index');
    Route::get('/create', [ProductController::class, 'create'])->name('create');
    Route::post('/store', [ProductController::class, 'store'])->name('store');
    Route::get('/edit/{id}', [ProductController::class, 'edit'])->name('edit');
    Route::post('/update/{id}', [ProductController::class, 'update'])->name('update');
    Route::get('/destroy/{id}', [ProductController::class, 'destroy'])->name('destroy');
    Route::get('/restore/{id}', [ProductController::class, 'restore'])->name('restore');
});

Route::prefix('admin/user')->name('admin.user.')->middleware([checkRoleAdmin::class])->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('index');
    Route::get('/destroy/{id}', [UserController::class, 'destroy'])->name('destroy');
    Route::get('/restore/{id}', [UserController::class, 'restore'])->name('restore');
});

Route::prefix('admin/orders')->name('admin.order.')->middleware([checkRoleAdmin::class])->group(function () {
    Route::get('/', [OrderController::class, 'index'])->name('index');
    Route::put('/{id}/status', [OrderController::class, 'updateStatus'])->name('updateStatus');
    Route::put('/{id}/delivery-status', [OrderController::class, 'updateDeliveryStatus'])->name('updateDeliveryStatus');
    Route::get('/{id}', [OrderController::class, 'show'])->name('show');
});

Route::get('/admin/revenue', [RevenueController::class, 'index'])->middleware([checkRoleAdmin::class])->name('admin.revenue.index');



Route::fallback(function (Request $request) {
    // Nếu gọi vào link /api/... mà sai, trả về JSON 404
    if ($request->is('api/*')) {
        return response()->json([
            'status' => 'error',
            'message' => 'API Route not found.'
        ], 404);
    }

    // Nếu là web thường thì redirect
    if(Auth::check()){
        if(Auth::user()->role_user==1){
            return redirect()->route('admin.category.index'); // Sửa lại đúng tên route admin của bạn
        }else if(Auth::user()->role_user==0){
            return redirect()->route('home');
        }
    }
    return redirect()->route('home');
});
