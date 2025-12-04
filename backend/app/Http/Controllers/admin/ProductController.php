<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public $categoryAll;

    public function __construct() {
    }

    private function getCategories() {
        if (empty($this->categoryAll)) {
            $this->categoryAll = DB::table('categories_product')
                ->where('status_category', 0)
                ->get();
        }
        return $this->categoryAll;
    }

    public function index(Request $request) {
        if ($request->expectsJson()) {
            try {
                // Xử lý các params đặc biệt từ frontend
                $perPageParam = $request->input('per_page') ?? $request->input('limit');
                $pageParam = $request->input('page');
                
                // Bỏ qua các params không hợp lệ như 'all', 'true', etc.
                $perPage = 20;
                if ($perPageParam && $perPageParam !== 'all' && $perPageParam !== 'true' && $perPageParam !== true) {
                    $perPageInt = filter_var($perPageParam, FILTER_VALIDATE_INT);
                    if ($perPageInt !== false && $perPageInt > 0) {
                        $perPage = $perPageInt;
                    }
                }
                
                $page = 1;
                if ($pageParam && $pageParam !== 'all' && $pageParam !== 'true' && $pageParam !== true) {
                    $pageInt = filter_var($pageParam, FILTER_VALIDATE_INT);
                    if ($pageInt !== false && $pageInt > 0) {
                        $page = $pageInt;
                    }
                }
                
                // Đảm bảo perPage và page hợp lệ
                if ($perPage < 1) $perPage = 20;
                if ($perPage > 1000) $perPage = 1000; // Giới hạn tối đa
                if ($page < 1) $page = 1;
                
                $offset = ($page - 1) * $perPage;
                
                // Kiểm tra xem có phải admin route không
                // Admin route: api/admin/products, Public route: api/products
                // Controller này được dùng cho cả 2 route nên cần kiểm tra path
                $path = $request->path(); // Ví dụ: "api/admin/products" hoặc "api/products"
                $isAdmin = strpos($path, 'admin') !== false;
                $statusFilter = $isAdmin ? null : 0; // Admin xem tất cả, public chỉ xem active
                
                // Tạo cache key dựa trên các tham số
                $cacheKey = 'products_' . ($isAdmin ? 'admin' : 'public') . '_page_' . $page . '_perpage_' . $perPage;
                
                // Cache total count riêng để tái sử dụng (cache 5 phút)
                $totalCacheKey = 'products_total_' . ($isAdmin ? 'admin' : 'public');
                $total = Cache::remember($totalCacheKey, 300, function () use ($statusFilter) {
                    $queryTotal = DB::table('products');
                    if ($statusFilter !== null) {
                        $queryTotal->where('status_product', $statusFilter);
                    }
                    return $queryTotal->count();
                });
                
                // Cache products list (cache 5 phút)
                $products = Cache::remember($cacheKey, 300, function () use ($statusFilter, $offset, $perPage) {
                    $queryProducts = DB::table('products')
                        ->leftJoin('categories_product', 'products.category_id', '=', 'categories_product.id')
                        ->select(
                            'products.id',
                            'products.name_product',
                            'products.price_product',
                            'products.description_product',
                            'products.image_product',
                            'products.quantity_product',
                            'products.status_product',
                            'products.category_id',
                            'categories_product.name_category'
                        );
                    
                    if ($statusFilter !== null) {
                        $queryProducts->where('products.status_product', $statusFilter);
                    }
                    
                    return $queryProducts->orderBy('products.id', 'desc')
                        ->offset($offset)
                        ->limit($perPage)
                        ->get();
                });

                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'products' => $products,
                        'pagination' => [
                            'current_page' => $page,
                            'per_page' => $perPage,
                            'total' => $total,
                            'last_page' => ceil($total / $perPage)
                        ]
                    ]
                ]);
            } catch (\Exception $e) {
                // Log lỗi và trả về response lỗi
                Log::error('ProductController@index error: ' . $e->getMessage(), [
                    'trace' => $e->getTraceAsString(),
                    'request' => $request->all(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]);
                
                return response()->json([
                    'status' => 'error',
                    'message' => 'Có lỗi xảy ra khi tải danh sách sản phẩm',
                    'error' => config('app.debug') ? [
                        'message' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'line' => $e->getLine()
                    ] : null
                ], 500);
            }
        }

        // Web view (không phải API)
        $products = DB::table('products')
            ->join('categories_product', 'products.category_id', '=', 'categories_product.id')
            ->select('products.*', 'categories_product.name_category')
            ->orderBy('products.id', 'desc')
            ->get();

        return view('admin.pages.product.index', compact('products'));
    }

    public function create() {
        $categoryAll = $this->getCategories();
        return view('admin.pages.product.create', compact('categoryAll'));
    }

    // --- SỬA LỖI Ở ĐÂY: THÊM quantity_product ---
    public function store(Request $request) {
        // Merge dữ liệu từ request để đảm bảo xử lý đúng kiểu dữ liệu
        // Chỉ merge khi giá trị tồn tại và không rỗng
        if ($request->has('category_id') && $request->input('category_id') !== null && $request->input('category_id') !== '') {
            $request->merge(['category_id' => (int) $request->input('category_id')]);
        }
        if ($request->has('price_product') && $request->input('price_product') !== null && $request->input('price_product') !== '') {
            $request->merge(['price_product' => (float) $request->input('price_product')]);
        }
        if ($request->has('quantity_product')) {
            $request->merge(['quantity_product' => (int) $request->input('quantity_product', 0)]);
        }

        $request->validate([
            'name_product' => 'required|string|max:255',
            'price_product' => 'required|numeric|min:0',
            'category_id' => 'required|integer|exists:categories_product,id',
            'description_product' => 'nullable|string',
            'quantity_product' => 'nullable|integer|min:0',
            'image_product' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = null;

        if ($request->hasFile('image_product')) {
            $file = $request->file('image_product');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/products'), $filename);
            $imagePath = 'uploads/products/' . $filename;
        }

        DB::table('products')->insert([
            'name_product' => $request->name_product,
            'price_product' => $request->price_product,
            'description_product' => $request->description_product,
            'quantity_product' => $request->input('quantity_product', 0), // <--- QUAN TRỌNG: Thêm dòng này
            'image_product' => $imagePath,
            'category_id' => $request->category_id,
            'status_product' => 0
        ]);

        // Clear cache
        $this->clearProductCache();

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Product Created'], 201);
        }
        return redirect()->route('admin.product.index')->with('success', 'Thêm sản phẩm thành công');
    }

    public function edit($id, Request $request) {
        $categoryAll = $this->getCategories();
        $product = DB::table('products')->where('id', $id)->first();

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'data' => $product]);
        }
        return view('admin.pages.product.edit', compact('product','categoryAll'));
    }

    // --- SỬA LỖI Ở ĐÂY: THÊM quantity_product VÀO UPDATE ---
    public function update(Request $request, $id) {
        // Xử lý FormData - hỗ trợ cả PUT và POST request
        // Với POST + FormData, Laravel sẽ tự động parse, nhưng với PUT thì không
        $allData = $request->all();
        
        // Nếu là POST request, dữ liệu sẽ được parse tự động
        // Nếu là PUT request và không có dữ liệu, thử đọc từ $_POST
        if ($request->method() === 'PUT' && (empty($allData) || (!isset($allData['name_product']) && !isset($allData['category_id'])))) {
            $allData = array_merge($allData, $_POST ?? []);
        }
        
        // Lấy từng trường một cách an toàn từ request
        $nameProduct = $request->input('name_product') ?? $allData['name_product'] ?? null;
        $priceProduct = $request->input('price_product') ?? $allData['price_product'] ?? null;
        $categoryId = $request->input('category_id') ?? $allData['category_id'] ?? null;
        $descriptionProduct = $request->input('description_product') ?? $allData['description_product'] ?? null;
        $quantityProduct = $request->input('quantity_product') ?? $allData['quantity_product'] ?? 0;
        
        // Convert kiểu dữ liệu
        $dataToValidate = [
            'name_product' => $nameProduct,
            'price_product' => $priceProduct !== null && $priceProduct !== '' ? (float) $priceProduct : null,
            'category_id' => $categoryId !== null && $categoryId !== '' ? (int) $categoryId : null,
            'description_product' => $descriptionProduct,
            'quantity_product' => (int) $quantityProduct,
        ];
        
        // Merge lại vào request để validation và xử lý file có thể hoạt động
        $request->merge($dataToValidate);

        // Sử dụng Validator::make() với dữ liệu đã merge
        $validator = Validator::make($request->all(), [
            'name_product' => 'required|string|max:255',
            'price_product' => 'required|numeric|min:0',
            'category_id' => 'required|integer|exists:categories_product,id',
            'description_product' => 'nullable|string',
            'quantity_product' => 'nullable|integer|min:0',
            'image_product' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                    'debug' => [
                        'received_data' => $request->all(),
                        'raw_post' => $_POST ?? [],
                    ]
                ], 422);
            }
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $productOld = DB::table('products')->where('id', $id)->first();

        $dataUpdate = [
            'name_product' => $request->name_product,
            'price_product' => $request->price_product,
            'description_product' => $request->description_product ?? null,
            'quantity_product' => $request->input('quantity_product', 0),
            'category_id' => $request->category_id,
        ];

        if ($request->hasFile('image_product')) {
            $file = $request->file('image_product');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/products'), $filename);

            $dataUpdate['image_product'] = 'uploads/products/' . $filename;

            if ($productOld && $productOld->image_product && File::exists(public_path($productOld->image_product))) {
                File::delete(public_path($productOld->image_product));
            }
        }

        DB::table('products')->where('id', $id)->update($dataUpdate);

        $this->clearProductCache();

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Product Updated']);
        }
        return redirect()->route('admin.product.index')->with('success', 'Cập nhật sản phẩm thành công');
    }

    public function destroy($id, Request $request) {
        DB::table('products')->where('id', $id)->update(['status_product' => 1]);
        $this->clearProductCache();

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Product Deleted (Soft)']);
        }
        return redirect()->route('admin.product.index')->with('success', 'Ẩn sản phẩm thành công!');
    }

    public function restore($id, Request $request) {
        DB::table('products')->where('id', $id)->update(['status_product' => 0]);
        $this->clearProductCache();

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Product Restored']);
        }
        return redirect()->route('admin.product.index')->with('success', 'Khôi phục sản phẩm thành công!');
    }

    // Hàm phụ để clear cache gọn hơn
    private function clearProductCache() {
        // Clear public cache
        Cache::forget('products_just_arrived');
        Cache::forget('top_selling_products');
        Cache::forget('products_total_count');
        Cache::forget('public_products_total_count');
        Cache::forget('dashboard_total_products');
        
        // Clear admin cache
        Cache::forget('admin_products_total_count');
        
        // Clear cache keys mới cho total count
        Cache::forget('products_total_admin');
        Cache::forget('products_total_public');
        
        // Clear paginated cache (xóa tất cả các trang đã cache)
        // Clear nhiều trang và per_page để đảm bảo không bỏ sót
        // Clear cả 2 format cache keys cũ và mới
        for ($page = 1; $page <= 100; $page++) {
            // Clear các per_page phổ biến: 10, 20, 50, 100, 200, 500, 1000
            $perPages = [10, 20, 50, 100, 200, 500, 1000];
            foreach ($perPages as $perPage) {
                // Clear cache keys cũ (nếu có)
                Cache::forget("public_products_page_{$page}_perpage_{$perPage}");
                Cache::forget("admin_products_page_{$page}_perpage_{$perPage}");
                // Clear cache keys mới với format: products_admin_page_X_perpage_Y
                Cache::forget("products_admin_page_{$page}_perpage_{$perPage}");
                Cache::forget("products_public_page_{$page}_perpage_{$perPage}");
            }
        }
        
        // Log để debug (chỉ trong development)
        if (config('app.debug')) {
            Log::info('Product cache cleared');
        }
    }
}
