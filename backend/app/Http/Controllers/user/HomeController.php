<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request){
        // 1. Lấy danh sách Category ID với cache (chỉ cho API)
        if ($request->expectsJson()) {
            $categoryIds = Cache::remember('category_ids_active', 3600, function () {
                return DB::table('categories_product')
                    ->where('status_category', 0)
                    ->pluck('id');
            });
        } else {
            $categoryIds = DB::table('categories_product')
                ->where('status_category', 0)
                ->pluck('id');
        }

        // 2. Sản phẩm mới về - Thêm filter status_product và cache (chỉ cho API)
        if ($request->expectsJson()) {
            $productJustArrived = Cache::remember('products_just_arrived', 1800, function () {
                return DB::table('products')
                    ->where('status_product', 0)
                    ->orderBy('id', 'desc')
                    ->limit(15)
                    ->get();
            });
        } else {
            $productJustArrived = DB::table('products')
                ->where('status_product', 0)
                ->orderBy('id', 'desc')
                ->limit(15)
                ->get();
        }

        // 3. Sản phẩm bán chạy - Cache 30 phút (chỉ cho API)
        if ($request->expectsJson()) {
            $topSellingProducts = Cache::remember('top_selling_products', 1800, function () {
                return DB::table('products')
                    ->join('order_details', 'products.id', '=', 'order_details.product_id')
                    ->join('orders', 'order_details.order_id', '=', 'orders.id')
                    ->select('products.id', 'products.name_product', 'products.price_product', 'products.image_product', DB::raw('SUM(order_details.quantity_detail) as total_sold'))
                    ->where('products.status_product', 0)
                    ->where('orders.status_order', 0)
                    ->groupBy('products.id', 'products.name_product', 'products.price_product', 'products.image_product')
                    ->orderByDesc('total_sold')
                    ->limit(15)
                    ->get();
            });
        } else {
            $topSellingProducts = DB::table('products')
                ->join('order_details', 'products.id', '=', 'order_details.product_id')
                ->join('orders', 'order_details.order_id', '=', 'orders.id')
                ->select('products.id', 'products.name_product', 'products.price_product', 'products.image_product', DB::raw('SUM(order_details.quantity_detail) as total_sold'))
                ->where('products.status_product', 0)
                ->where('orders.status_order', 0)
                ->groupBy('products.id', 'products.name_product', 'products.price_product', 'products.image_product')
                ->orderByDesc('total_sold')
                ->limit(15)
                ->get();
        }

        // 4. Trending theo danh mục - Tối ưu: Lấy tất cả trong 1 query thay vì N queries
        $allTrendingProducts = DB::table('products')
            ->whereIn('category_id', $categoryIds->toArray())
            ->where('status_product', 0)
            ->select(
                'products.id as product_id',
                'products.name_product',
                'products.price_product',
                'products.image_product',
                'products.category_id'
            )
            ->orderByDesc('products.id')
            ->get()
            ->groupBy('category_id');

        // Chỉ lấy 10 sản phẩm đầu tiên cho mỗi category
        $productTrending = [];
        foreach ($categoryIds as $categoryId) {
            $products = $allTrendingProducts->get($categoryId, collect())->take(10);
            if ($products->isNotEmpty()) {
                $productTrending[$categoryId] = $products->values();
            }
        }

        // TRẢ VỀ JSON
        if ($request->expectsJson()) {
            // Cache categories (chỉ cho API)
            $categories = Cache::remember('categories_active', 3600, function () {
                return DB::table('categories_product')
                    ->where('status_category', 0)
                    ->get();
            });
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'categories' => $categories,
                    'just_arrived' => $productJustArrived,
                    'top_selling' => $topSellingProducts,
                    'trending' => $productTrending
                ]
            ]);
        }

        // Fallback view cũ
        $CategoriesHeader=$this->CategoriesHeader;
        return view('user.pages.index',compact('CategoriesHeader','productJustArrived','topSellingProducts','productTrending'));
    }

    public function productDetail($id, Request $request){
        $product = DB::table('products')
            ->join('categories_product', 'products.category_id', '=', 'categories_product.id')
            ->where('products.id', $id)
            ->where('products.status_product', 0)
            ->select('products.*', 'categories_product.name_category')
            ->first();

        if (!$product) {
            if ($request->expectsJson()) return response()->json(['status'=>'error', 'message'=>'Product not found'], 404);
            return redirect()->route('home');
        }

        // Lấy product attributes (size/color) nếu bảng đã tồn tại
        $attributes = [];
        try {
            if (DB::getSchemaBuilder()->hasTable('product_attributes')) {
                $attributes = DB::table('product_attributes')
                    ->where('product_id', $id)
                    ->get();
            }
        } catch (\Exception $e) {
            // Bỏ qua nếu bảng chưa tồn tại
        }

        if ($request->expectsJson()) {
            return response()->json([
                'status' => 'success', 
                'data' => [
                    'product' => $product,
                    'attributes' => $attributes
                ]
            ]);
        }

        $CategoriesHeader=$this->CategoriesHeader;
        return view('user.pages.product-detail',compact('CategoriesHeader','product', 'attributes'));
    }

    public function showProductsByCategory($id, Request $request)
    {
        $category = DB::table('categories_product')->where('status_category', 0)->find($id);
        if(!$category) {
            if ($request->expectsJson()) return response()->json(['status'=>'error', 'message'=>'Category not found'], 404);
            return redirect()->route('home');
        }

        // Pagination cho API
        if ($request->expectsJson()) {
            $perPage = $request->input('per_page', 15);
            $page = $request->input('page', 1);
            $offset = ($page - 1) * $perPage;
            
            $total = DB::table('products')
                ->where('category_id', $id)
                ->where('status_product', 0)
                ->count();
            
            $products = DB::table('products')
                ->where('category_id', $id)
                ->where('status_product', 0)
                ->orderByDesc('products.id')
                ->offset($offset)
                ->limit($perPage)
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'category' => $category,
                    'products' => $products,
                    'pagination' => [
                        'current_page' => (int)$page,
                        'per_page' => (int)$perPage,
                        'total' => $total,
                        'last_page' => ceil($total / $perPage)
                    ]
                ]
            ]);
        }

        $products = DB::table('products')
                    ->where('category_id', $id)
                    ->where('status_product', 0)
                    ->orderByDesc('products.id')
                    ->get();

        $CategoriesHeader=$this->CategoriesHeader;
        return view('user.pages.products-by-category', [
            'categoryName' => $category->name_category,
            'categoryId' => $category->id,
            'products' => $products,
            'CategoriesHeader'=> $CategoriesHeader,
        ]);
    }

    public function showProductsBySearch(Request $request)
    {
        // Hỗ trợ cả JSON và form-data
        $name = $request->input('name') ?? $request->input('search') ?? $request->input('keyword');
        
        // Kiểm tra nếu là JSON request
        if ($name === null && $request->isJson()) {
            $jsonData = $request->json()->all();
            $name = $jsonData['name'] ?? $jsonData['search'] ?? $jsonData['keyword'] ?? null;
        }

        // Validation
        if (empty($name) || trim($name) === '') {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Từ khóa tìm kiếm không được để trống'
                ], 400);
            }
            return redirect()->route('home')->with('error', 'Vui lòng nhập từ khóa tìm kiếm');
        }

        // Tìm kiếm không phân biệt hoa thường, tìm theo tên và mô tả
        $searchTerm = '%' . trim($name) . '%';
        
        // Pagination cho API search
        if ($request->expectsJson()) {
            $perPage = $request->input('per_page', 15);
            $page = $request->input('page', 1);
            $offset = ($page - 1) * $perPage;
            
            $total = DB::table('products')
                ->leftJoin('categories_product', 'products.category_id', '=', 'categories_product.id')
                ->where('products.status_product', 0)
                ->where(function($query) use ($searchTerm) {
                    $query->where('products.name_product', 'like', $searchTerm)
                          ->orWhere('products.description_product', 'like', $searchTerm);
                })
                ->count();
            
            $products = DB::table('products')
                ->leftJoin('categories_product', 'products.category_id', '=', 'categories_product.id')
                ->where('products.status_product', 0)
                ->where(function($query) use ($searchTerm) {
                    $query->where('products.name_product', 'like', $searchTerm)
                          ->orWhere('products.description_product', 'like', $searchTerm);
                })
                ->select(
                    'products.*',
                    'categories_product.name_category'
                )
                ->orderByDesc('products.id')
                ->offset($offset)
                ->limit($perPage)
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'products' => $products,
                    'search_term' => trim($name),
                    'pagination' => [
                        'current_page' => (int)$page,
                        'per_page' => (int)$perPage,
                        'total' => $total,
                        'last_page' => ceil($total / $perPage)
                    ]
                ]
            ]);
        }
        
        $products = DB::table('products')
            ->leftJoin('categories_product', 'products.category_id', '=', 'categories_product.id')
            ->where('products.status_product', 0)
            ->where(function($query) use ($searchTerm) {
                $query->where('products.name_product', 'like', $searchTerm)
                      ->orWhere('products.description_product', 'like', $searchTerm);
            })
            ->select(
                'products.*',
                'categories_product.name_category'
            )
            ->orderByDesc('products.id')
            ->get();

        $CategoriesHeader = $this->CategoriesHeader;
        return view('user.pages.products-by-search', [
            'products' => $products,
            'CategoriesHeader'=> $CategoriesHeader,
            'name'=> trim($name),
        ]);
    }
}
