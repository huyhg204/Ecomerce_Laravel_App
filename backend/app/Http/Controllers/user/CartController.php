<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function __construct()
    {
        parent::__construct();

        if (Auth::check()) {
            $userId = Auth::user()->id;

            if (!session()->has('cart')) {
                $cartFromDb = DB::table('carts')
                    ->join('products', 'carts.product_id', '=', 'products.id')
                    ->where('carts.user_id', $userId)
                    ->select(
                        'carts.product_id', 'carts.quantity_item', 'carts.total_item',
                        'products.image_product', 'products.name_product', 'products.price_product'
                    )
                    ->get();
                $cart = [];
                foreach ($cartFromDb as $item) {
                    $cart[$item->product_id] = [
                        'product_id'    => $item->product_id,
                        'image_product' => $item->image_product,
                        'name_product'  => $item->name_product,
                        'price_product' => $item->price_product,
                        'quantity_item' => $item->quantity_item,
                        'total_item'    => $item->total_item,
                    ];
                }
                session()->put('cart', $cart);
            }
        }
    }

    public function cart(Request $request){
        $cart = session('cart', []);
        $total = array_sum(array_column($cart, 'total_item'));

        if ($request->expectsJson()) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'cart' => array_values($cart), // Chuyển sang mảng tuần tự
                    'total' => $total
                ]
            ]);
        }

        $CategoriesHeader=$this->CategoriesHeader;
        return view('user.pages.cart',compact('CategoriesHeader','cart','total'));
    }

    public function addToCart(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity_item', 1);

        $product = DB::table('products')
            ->select('id', 'image_product', 'name_product', 'price_product', 'quantity_product')
            ->where('id', $productId)
            ->first();

        if (!$product) {
            if ($request->expectsJson()) return response()->json(['status'=>'error', 'message'=>'Product not found'], 404);
            return back()->with('error', 'Sản phẩm không tồn tại.');
        }

        $userId = Auth::id();
        $currentQuantityInCart = 0;

        if ($userId) {
            $dbCart = DB::table('carts')->where('user_id', $userId)->where('product_id', $productId)->first();
            $currentQuantityInCart = $dbCart ? $dbCart->quantity_item : 0;
        } else {
            $sessionCart = session()->get('cart', []);
            $currentQuantityInCart = isset($sessionCart[$productId]) ? $sessionCart[$productId]['quantity_item'] : 0;
        }

        $newTotalQuantity = $currentQuantityInCart + $quantity;

        if ($newTotalQuantity > $product->quantity_product) {
            $msg = 'Số lượng vượt quá kho. Chỉ còn ' . $product->quantity_product;
            if ($request->expectsJson()) return response()->json(['status'=>'error', 'message'=>$msg], 400);
            return back()->with('error', $msg);
        }

        if ($userId) {
            if ($dbCart) {
                DB::table('carts')->where('user_id', $userId)->where('product_id', $productId)->update([
                    'quantity_item' => $newTotalQuantity,
                    'total_item' => $newTotalQuantity * $product->price_product
                ]);
            } else {
                DB::table('carts')->insert([
                    'user_id' => $userId, 'product_id' => $productId,
                    'quantity_item' => $quantity, 'total_item' => $quantity * $product->price_product,
                ]);
            }
        }

        $cart = session()->get('cart', []);
        $cart[$productId] = [
            'product_id'    => $product->id,
            'image_product' => $product->image_product,
            'name_product'  => $product->name_product,
            'price_product' => $product->price_product,
            'quantity_item' => $newTotalQuantity,
            'total_item'    => $newTotalQuantity * $product->price_product,
        ];
        session()->put('cart', $cart);

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Added to cart']);
        }
        return back()->with('success', 'Thêm sản phẩm vào giỏ hàng thành công!');
    }

    public function removeFromCart(Request $request)
    {
        $productId = $request->input('product_id');
        $cart = session('cart', []);
        $userId = Auth::id();

        if ($userId) {
            DB::table('carts')->where('user_id', $userId)->where('product_id', $productId)->delete();
        }

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            session(['cart' => $cart]);
        }

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Removed from cart']);
        }
        return back()->with('success', 'Xóa sản phẩm khỏi giỏ hàng thành công!');
    }
}
