<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // Lấy danh sách danh mục
    public function index(Request $request) {
        // Cache categories trong 1 giờ (chỉ cho API)
        if ($request->expectsJson()) {
            $categories = Cache::remember('categories_all', 3600, function () {
                return DB::table('categories_product')
                    ->orderByDesc('id')
                    ->get();
            });
        } else {
            $categories = DB::table('categories_product')
                ->orderByDesc('id')
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $categories
        ], 200);
    }

    // Tạo danh mục mới
    public function store(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'name_category' => 'required|string|max:255',
                'image_category' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'description_category' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $imagePath = null;

            if ($request->hasFile('image_category')) {
                $file = $request->file('image_category');
                $uploadPath = public_path('uploads/categories');
                
                // Tạo thư mục nếu chưa tồn tại
                if (!File::exists($uploadPath)) {
                    File::makeDirectory($uploadPath, 0755, true);
                }
                
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move($uploadPath, $filename);
                $imagePath = 'uploads/categories/' . $filename;
            } elseif ($request->has('image_category') && is_string($request->input('image_category')) && $request->input('image_category') !== '') {
                // Hỗ trợ cả link ảnh (backward compatibility)
                $imagePath = $request->input('image_category');
            }

            $insertData = [
                'name_category' => $request->input('name_category'),
                'image_category' => $imagePath,
            ];
            
            $id = DB::table('categories_product')->insertGetId($insertData);

            // Clear cache khi thêm mới
            Cache::forget('categories_all');
            Cache::forget('categories_active');
            Cache::forget('category_ids_active');

            return response()->json([
                'status' => 'success',
                'message' => 'Thêm danh mục thành công!',
                'data' => [
                    'id' => $id,
                    'name_category' => $request->input('name_category')
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo danh mục: ' . $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật danh mục
    public function update(Request $request, $id) {
        try {
            // Xử lý FormData - hỗ trợ cả PUT và POST request với _method=PUT
            $allData = $request->all();
            
            // Nếu là POST request với FormData, dữ liệu sẽ được parse tự động
            // Nếu là PUT request và không có dữ liệu, thử đọc từ $_POST
            if ($request->method() === 'PUT' && (empty($allData) || !isset($allData['name_category']))) {
                $allData = array_merge($allData, $_POST ?? []);
            }
            
            // Lấy từng trường một cách an toàn từ request
            $nameCategory = $request->input('name_category') ?? $allData['name_category'] ?? null;
            
            // Merge lại vào request để validation và xử lý file có thể hoạt động
            if ($nameCategory !== null) {
                $request->merge(['name_category' => $nameCategory]);
            }

            $validator = Validator::make($request->all(), [
                'name_category' => 'required|string|max:255',
                'image_category' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
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

            $categoryOld = DB::table('categories_product')->where('id', $id)->first();
            
            if (!$categoryOld) {
                return response()->json(['status' => 'error', 'message' => 'Không tìm thấy danh mục'], 404);
            }

            $dataUpdate = [
                'name_category' => $request->input('name_category'),
            ];

            // Xử lý hình ảnh
            if ($request->hasFile('image_category')) {
                $file = $request->file('image_category');
                $uploadPath = public_path('uploads/categories');
                
                // Tạo thư mục nếu chưa tồn tại
                if (!File::exists($uploadPath)) {
                    File::makeDirectory($uploadPath, 0755, true);
                }
                
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move($uploadPath, $filename);
                $dataUpdate['image_category'] = 'uploads/categories/' . $filename;

                // Xóa file cũ nếu tồn tại
                if ($categoryOld->image_category && File::exists(public_path($categoryOld->image_category))) {
                    File::delete(public_path($categoryOld->image_category));
                }
            } elseif ($request->has('image_category') && is_string($request->input('image_category')) && $request->input('image_category') !== '') {
                // Hỗ trợ cả link ảnh (backward compatibility)
                $dataUpdate['image_category'] = $request->input('image_category');
            }

            // Note: description_category không tồn tại trong bảng categories_product

            $updated = DB::table('categories_product')->where('id', $id)->update($dataUpdate);

            if ($updated !== false) {
                // Clear cache khi cập nhật
                Cache::forget('categories_all');
                Cache::forget('categories_active');
                Cache::forget('category_ids_active');
                
                return response()->json(['status' => 'success', 'message' => 'Cập nhật danh mục thành công!'], 200);
            }

            return response()->json(['status' => 'error', 'message' => 'Lỗi cập nhật'], 500);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi cập nhật danh mục: ' . $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    // Xóa mềm danh mục (Soft Delete)
    public function destroy($id) {
        DB::table('categories_product')->where('id', $id)->update([
            'status_category' => 1, // 1 là ẩn
        ]);

        // Clear cache khi xóa
        Cache::forget('categories_all');
        Cache::forget('categories_active');
        Cache::forget('category_ids_active');

        return response()->json(['status' => 'success', 'message' => 'Xóa danh mục thành công!'], 200);
    }

    // Khôi phục danh mục
    public function restore($id) {
        DB::table('categories_product')->where('id', $id)->update([
            'status_category' => 0, // 0 là hiện
        ]);

        // Clear cache khi khôi phục
        Cache::forget('categories_all');
        Cache::forget('categories_active');
        Cache::forget('category_ids_active');

        return response()->json(['status' => 'success', 'message' => 'Khôi phục danh mục thành công!'], 200);
    }


    // API không cần các hàm create() và edit() trả về View Form
}
