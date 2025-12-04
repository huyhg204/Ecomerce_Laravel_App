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
                    // Tính giá thực tế (ưu tiên discount_price, nếu không có thì dùng price_product)
                    $actualPrice = $item->discount_price ?? $item->price_product;
                    $originalPrice = $item->original_price ?? $item->price_product;
                    $totalItem = $item->quantity_item * $actualPrice;
                    
                    // Key kết hợp product_id và size để phân biệt các item cùng sản phẩm nhưng khác size
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
                        'total_item'    => $totalItem,
                        'total_original' => $item->quantity_item * $originalPrice, // Tổng giá gốc
                    ];
                }
                session()->put('cart', $cart);
            }
        }
    }

    public function cart(Request $request){
        $cart = session('cart', []);
        
        // Tính tổng giá sau giảm (tạm tính)
        $subtotal = array_sum(array_column($cart, 'total_item'));
        
        // Tính tổng giá gốc
        $totalOriginal = 0;
        foreach ($cart as $item) {
            $originalPrice = $item['original_price'] ?? $item['price_product'];
            $totalOriginal += $originalPrice * $item['quantity_item'];
        }
        
        // Tiết kiệm = tổng giá gốc - tổng giá sau giảm
        $savings = $totalOriginal - $subtotal;
        
        // Tổng thanh toán (chưa có voucher, sẽ được tính khi checkout)
        $total = $subtotal;

        if ($request->expectsJson()) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'cart' => array_values($cart),
                    'subtotal' => $subtotal, // Tạm tính (tổng giá sau giảm)
                    'total_original' => $totalOriginal, // Tổng giá gốc
                    'savings' => $savings, // Tiết kiệm
                    'total' => $total // Tổng thanh toán (chưa có voucher)
                ]
            ]);
        }

        $CategoriesHeader=$this->CategoriesHeader;
        return view('user.pages.cart',compact('CategoriesHeader','cart','total', 'subtotal', 'totalOriginal', 'savings'));
    }

    public function addToCart(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity_item', 1);
        $updateMode = $request->input('update_mode', false); // Nếu true, sẽ set quantity mới thay vì cộng thêm

        $product = DB::table('products')
            ->select('id', 'image_product', 'name_product', 'price_product', 
                    'original_price', 'discount_price', 'discount_percent', 'quantity_product')
            ->where('id', $productId)
            ->first();

        if (!$product) {
            if ($request->expectsJson()) return response()->json(['status'=>'error', 'message'=>'Product not found'], 404);
            return back()->with('error', 'Sản phẩm không tồn tại.');
        }

        // Lấy size và product_attribute_id nếu có
        $size = $request->input('size');
        $productAttributeId = $request->input('product_attribute_id');
        
        // Nếu có size, kiểm tra tồn kho của size đó
        $availableQuantity = $product->quantity_product;
        if ($productAttributeId) {
            $attribute = DB::table('product_attributes')
                ->where('id', $productAttributeId)
                ->where('product_id', $productId)
                ->first();
            if ($attribute) {
                $availableQuantity = $attribute->quantity;
            }
        }

        $userId = Auth::id();
        $currentQuantityInCart = 0;

        // Tìm cart item với cùng product_id và size (nếu có)
        $cartKey = $productId . ($size ? '_' . $size : '');
        
        if ($userId) {
            $query = DB::table('carts')->where('user_id', $userId)->where('product_id', $productId);
            if ($size) {
                $query->where('size', $size);
            }
            $dbCart = $query->first();
            $currentQuantityInCart = $dbCart ? $dbCart->quantity_item : 0;
        } else {
            $sessionCart = session()->get('cart', []);
            $currentQuantityInCart = isset($sessionCart[$cartKey]) ? $sessionCart[$cartKey]['quantity_item'] : 0;
        }

        // Nếu update_mode = true, set quantity mới; nếu không, cộng thêm
        $newTotalQuantity = $updateMode ? $quantity : ($currentQuantityInCart + $quantity);
        
        // Kiểm tra quantity hợp lệ
        if ($newTotalQuantity < 1) {
            $msg = 'Số lượng phải lớn hơn 0';
            if ($request->expectsJson()) return response()->json(['status'=>'error', 'message'=>$msg], 400);
            return back()->with('error', $msg);
        }

        if ($newTotalQuantity > $availableQuantity) {
            $msg = 'Số lượng vượt quá kho. Chỉ còn ' . $availableQuantity;
            if ($request->expectsJson()) return response()->json(['status'=>'error', 'message'=>$msg], 400);
            return back()->with('error', $msg);
        }

        // Tính giá thực tế (ưu tiên discount_price)
        $actualPrice = $product->discount_price ?? $product->price_product;
        $originalPrice = $product->original_price ?? $product->price_product;
        $totalItem = $newTotalQuantity * $actualPrice;
        $totalOriginal = $newTotalQuantity * $originalPrice;

        if ($userId) {
            if ($dbCart) {
                DB::table('carts')
                    ->where('user_id', $userId)
                    ->where('product_id', $productId)
                    ->where(function($q) use ($size) {
                        if ($size) {
                            $q->where('size', $size);
                        } else {
                            $q->whereNull('size');
                        }
                    })
                    ->update([
                        'quantity_item' => $newTotalQuantity,
                        'total_item' => $totalItem,
                        'product_attribute_id' => $productAttributeId,
                        'size' => $size,
                    ]);
            } else {
                DB::table('carts')->insert([
                    'user_id' => $userId,
                    'product_id' => $productId,
                    'product_attribute_id' => $productAttributeId,
                    'size' => $size,
                    'quantity_item' => $quantity,
                    'total_item' => $totalItem,
                ]);
            }
        }

        $cart = session()->get('cart', []);
        $cart[$cartKey] = [
            'product_id'    => $product->id,
            'product_attribute_id' => $productAttributeId,
            'size' => $size,
            'image_product' => $product->image_product,
            'name_product'  => $product->name_product,
            'price_product' => $actualPrice,
            'original_price' => $originalPrice,
            'discount_price' => $product->discount_price,
            'discount_percent' => $product->discount_percent,
            'quantity_item' => $newTotalQuantity,
            'total_item'    => $totalItem,
            'total_original' => $totalOriginal,
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
        $size = $request->input('size');
        $cart = session('cart', []);
        $userId = Auth::id();

        // Tạo cartKey giống như khi thêm vào giỏ
        $cartKey = $productId . ($size ? '_' . $size : '');

        if ($userId) {
            $query = DB::table('carts')->where('user_id', $userId)->where('product_id', $productId);
            if ($size) {
                $query->where('size', $size);
            } else {
                $query->whereNull('size');
            }
            $query->delete();
        }

        if (isset($cart[$cartKey])) {
            unset($cart[$cartKey]);
            session(['cart' => $cart]);
        }

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Removed from cart']);
        }
        return back()->with('success', 'Xóa sản phẩm khỏi giỏ hàng thành công!');
    }
}
