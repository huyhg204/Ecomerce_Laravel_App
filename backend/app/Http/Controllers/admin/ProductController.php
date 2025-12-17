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
                    // Kiểm tra xem các cột mới có tồn tại không
                    $hasPriceFields = $this->checkColumnExists('products', 'original_price');
                    
                    // Kiểm tra xem bảng reviews có tồn tại không
                    $hasReviewsTable = $this->checkTableExists('reviews');
                    
                    $queryProducts = DB::table('products')
                        ->leftJoin('categories_product', 'products.category_id', '=', 'categories_product.id');
                    
                    // Nếu có bảng reviews, join để lấy số đánh giá và rating trung bình (chỉ tính đánh giá đang hiển thị)
                    if ($hasReviewsTable) {
                        $queryProducts->leftJoin(DB::raw('(SELECT product_id, COUNT(*) as reviews_count, AVG(rating) as average_rating FROM reviews WHERE status = 1 GROUP BY product_id) as reviews_stats'), 'products.id', '=', 'reviews_stats.product_id');
                    }
                    
                    // Select các cột cơ bản
                    $selectFields = [
                        'products.id',
                        'products.name_product',
                        'products.description_product',
                        'products.image_product',
                        'products.status_product',
                        'products.category_id',
                        'categories_product.name_category'
                    ];
                    
                    // Thêm reviews_count và average_rating nếu có bảng reviews
                    if ($hasReviewsTable) {
                        $selectFields[] = DB::raw('COALESCE(reviews_stats.reviews_count, 0) as reviews_count');
                        $selectFields[] = DB::raw('COALESCE(ROUND(reviews_stats.average_rating, 1), 0) as average_rating');
                    } else {
                        $selectFields[] = DB::raw('0 as reviews_count');
                        $selectFields[] = DB::raw('0 as average_rating');
                    }
                    
                    // Thêm các cột mới nếu đã tồn tại
                    if ($hasPriceFields) {
                        $selectFields[] = 'products.original_price';
                        $selectFields[] = 'products.discount_price';
                        $selectFields[] = 'products.discount_percent';
                    }
                    
                    $queryProducts->select($selectFields);
                    
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

    public function store(Request $request) {
        // Merge dữ liệu từ request để đảm bảo xử lý đúng kiểu dữ liệu
        if ($request->has('category_id') && $request->input('category_id') !== null && $request->input('category_id') !== '') {
            $request->merge(['category_id' => (int) $request->input('category_id')]);
        }
        
        // Xử lý giá gốc và giá giảm
        if ($request->has('original_price')) {
            $request->merge(['original_price' => (float) $request->input('original_price')]);
        }
        if ($request->has('discount_price')) {
            $request->merge(['discount_price' => (float) $request->input('discount_price')]);
        }
        if ($request->has('discount_percent')) {
            $request->merge(['discount_percent' => (int) $request->input('discount_percent', 0)]);
        }

        $request->validate([
            'name_product' => 'required|string|max:255',
            'original_price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'category_id' => 'required|integer|exists:categories_product,id',
            'description_product' => 'nullable|string',
            'image_product' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'attributes' => 'nullable', // Format mới: có thể là JSON string hoặc array
        ]);

        $imagePath = null;

        if ($request->hasFile('image_product')) {
            $file = $request->file('image_product');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/products'), $filename);
            $imagePath = 'uploads/products/' . $filename;
        }

        // Tính toán giá: nhập giá gốc và % giảm, tự động tính giá giảm
        $originalPrice = $request->input('original_price');
        $discountPercent = $request->input('discount_percent', 0);
        $discountPrice = null;
        
        // Nếu có original_price và discount_percent, tính discount_price
        if ($originalPrice && $discountPercent > 0) {
            $originalPriceInt = (int)round($originalPrice, 0);
            $discountPercentInt = (int)round($discountPercent, 0);
            $discountPrice = ($originalPriceInt * (100 - $discountPercentInt)) / 100;
            $discountPrice = (int)round($discountPrice);
        }
        
        $insertData = [
            'name_product' => $request->name_product,
            'description_product' => $request->description_product,
            'image_product' => $imagePath,
            'category_id' => $request->category_id,
            'status_product' => 0,
            'original_price' => $originalPrice ? (float)round($originalPrice, 2) : null,
            'discount_price' => $discountPrice ? (float)$discountPrice : null,
            'discount_percent' => $discountPercent ? (int)round($discountPercent, 0) : 0
        ];

        $productId = DB::table('products')->insertGetId($insertData);

        // Thêm các thuộc tính sản phẩm (size và quantity)
        if ($request->has('attributes')) {
            $attributesData = $request->input('attributes');
            if (is_string($attributesData)) {
                $attributesData = json_decode($attributesData, true);
            }
            
            if (is_array($attributesData)) {
                foreach ($attributesData as $attrData) {
                    if (!empty($attrData['size'])) {
                        try {
                            DB::table('product_attributes')->insert([
                                'product_id' => $productId,
                                'size' => $attrData['size'],
                                'quantity' => $attrData['quantity'] ?? 0,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        } catch (\Exception $e) {
                            Log::error('Error adding attribute: ' . $e->getMessage());
                        }
                    }
                }
            }
        }

        // Clear cache
        $this->clearProductCache();

        if ($request->expectsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Product Created'], 201);
        }
        return redirect()->route('admin.product.index')->with('success', 'Thêm sản phẩm thành công');
    }

    public function edit($id, Request $request) {
        try {
            // Lấy sản phẩm
            $product = DB::table('products')->where('id', $id)->first();
            
            if (!$product) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Sản phẩm không tồn tại'
                    ], 404);
                }
                return redirect()->back()->with('error', 'Sản phẩm không tồn tại');
            }
            
            // Lấy tên category
            $categoryName = null;
            if (isset($product->category_id) && $product->category_id) {
                try {
                    $category = DB::table('categories_product')->where('id', $product->category_id)->first();
                    if ($category && isset($category->name_category)) {
                        $categoryName = $category->name_category;
                    }
                } catch (\Exception $e) {
                    // Bỏ qua lỗi
                }
            }
            
            // Lấy thuộc tính sản phẩm
            $productAttributes = [];
            try {
                $attrs = DB::table('product_attributes')
                    ->where('product_id', $id)
                    ->get();
                
                foreach ($attrs as $attr) {
                    $productAttributes[] = [
                        'id' => $attr->id ?? null,
                        'size' => $attr->size ?? null,
                        'quantity' => (int)($attr->quantity ?? 0)
                    ];
                }
            } catch (\Exception $e) {
                $productAttributes = [];
            }
            
            if ($request->expectsJson()) {
                // Tạo response array - kiểm tra từng trường an toàn
                $originalPrice = null;
                if (isset($product->original_price) && $product->original_price !== null && $product->original_price !== '') {
                    $originalPrice = is_numeric($product->original_price) ? (float)round($product->original_price, 2) : null;
                }
                
                $discountPrice = null;
                if (isset($product->discount_price) && $product->discount_price !== null && $product->discount_price !== '') {
                    // Làm tròn về số nguyên khi đọc từ database (vì giá giảm phải là số nguyên)
                    $discountPrice = is_numeric($product->discount_price) ? (int)round($product->discount_price, 0) : null;
                }
                
                $discountPercent = null;
                if (isset($product->discount_percent) && $product->discount_percent !== null && $product->discount_percent !== '') {
                    $discountPercent = is_numeric($product->discount_percent) ? (int)round($product->discount_percent, 0) : null;
                }
                
                $productData = [
                    'id' => isset($product->id) ? (int)$product->id : null,
                    'name_product' => isset($product->name_product) ? (string)$product->name_product : '',
                    'description_product' => isset($product->description_product) ? (string)$product->description_product : null,
                    'image_product' => isset($product->image_product) ? (string)$product->image_product : null,
                    'status_product' => isset($product->status_product) ? (int)$product->status_product : 0,
                    'category_id' => isset($product->category_id) ? (int)$product->category_id : null,
                    'name_category' => $categoryName,
                    'original_price' => $originalPrice,
                    'discount_price' => $discountPrice,
                    'discount_percent' => $discountPercent
                ];
                
                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'product' => $productData,
                        'attributes' => $productAttributes
                    ]
                ]);
            }
            
            $categoryAll = $this->getCategories();
            return view('admin.pages.product.edit', compact('product', 'categoryAll', 'productAttributes'));
        } catch (\Exception $e) {
            Log::error('ProductController@edit error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'product_id' => $id,
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Có lỗi xảy ra khi lấy thông tin sản phẩm',
                    'error' => config('app.debug') ? $e->getMessage() : null
                ], 500);
            }
            return redirect()->back()->with('error', 'Có lỗi xảy ra khi lấy thông tin sản phẩm');
        }
    }

    public function update(Request $request, $id) {
        $allData = $request->all();
        
        if ($request->method() === 'PUT' && (empty($allData) || (!isset($allData['name_product']) && !isset($allData['category_id'])))) {
            $allData = array_merge($allData, $_POST ?? []);
        }
        
        $nameProduct = $request->input('name_product') ?? $allData['name_product'] ?? null;
        $categoryId = $request->input('category_id') ?? $allData['category_id'] ?? null;
        $descriptionProduct = $request->input('description_product') ?? $allData['description_product'] ?? null;
        
        $dataToValidate = [
            'name_product' => $nameProduct,
            'category_id' => $categoryId !== null && $categoryId !== '' ? (int) $categoryId : null,
            'description_product' => $descriptionProduct,
        ];
        
        $request->merge($dataToValidate);

        $originalPrice = $request->input('original_price');
        $discountPercent = $request->input('discount_percent', 0);
        
        if ($originalPrice !== null) {
            $request->merge(['original_price' => (float) $originalPrice]);
        }
        if ($discountPercent !== null) {
            $request->merge(['discount_percent' => (int) $discountPercent]);
        }

        $validator = Validator::make($request->all(), [
            'name_product' => 'required|string|max:255',
            'original_price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'category_id' => 'required|integer|exists:categories_product,id',
            'description_product' => 'nullable|string',
            'image_product' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'attributes' => 'nullable',
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

        // Tính toán giá
        $originalPrice = $request->input('original_price');
        $discountPercent = $request->input('discount_percent', 0);
        $discountPrice = null;
        
        if ($originalPrice && $discountPercent > 0) {
            $originalPriceInt = (int)round($originalPrice, 0);
            $discountPercentInt = (int)round($discountPercent, 0);
            $discountPrice = ($originalPriceInt * (100 - $discountPercentInt)) / 100;
            $discountPrice = (int)round($discountPrice);
        }

        $dataUpdate = [
            'name_product' => $request->name_product,
            'description_product' => $request->description_product ?? null,
            'category_id' => $request->category_id,
            'original_price' => $originalPrice ? (float)round($originalPrice, 2) : null,
            'discount_price' => $discountPrice ? (float)$discountPrice : null,
            'discount_percent' => $discountPercent ? (int)round($discountPercent, 0) : 0
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

        // Cập nhật thuộc tính sản phẩm
        if ($request->has('attributes')) {
            try {
                DB::table('product_attributes')->where('product_id', $id)->delete();
                
                $attributesData = $request->input('attributes');
                if (is_string($attributesData)) {
                    $attributesData = json_decode($attributesData, true);
                }
                
                if (is_array($attributesData)) {
                    foreach ($attributesData as $attrData) {
                        if (!empty($attrData['size'])) {
                            DB::table('product_attributes')->insert([
                                'product_id' => $id,
                                'size' => $attrData['size'],
                                'quantity' => $attrData['quantity'] ?? 0,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error('Error updating attributes: ' . $e->getMessage());
            }
        }

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

    /**
     * Kiểm tra xem cột có tồn tại trong bảng không
     */
    private function checkColumnExists($table, $column) {
        try {
            $columns = DB::getSchemaBuilder()->getColumnListing($table);
            return in_array($column, $columns);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Kiểm tra xem bảng có tồn tại không
     */
    private function checkTableExists($table) {
        try {
            return DB::getSchemaBuilder()->hasTable($table);
        } catch (\Exception $e) {
            return false;
        }
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
