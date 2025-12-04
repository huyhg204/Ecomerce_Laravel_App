<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class BannerController extends Controller
{
    // Lấy danh sách banner
    public function index(Request $request) {
        try {
            $position = $request->input('position'); // Lọc theo vị trí (0: hero slider, 1: banner single)
            
            $query = DB::table('banners');
            
            // Nếu có filter position
            if ($position !== null) {
                $query->where('position', $position);
            }
            
            // Nếu là public request, chỉ lấy banner đang hoạt động
            if (!$request->expectsJson() || strpos($request->path(), 'admin') === false) {
                $query->where('status', 1);
            }
            
            $banners = $query->orderBy('order')->orderByDesc('id')->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $banners
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi lấy danh sách banner: ' . $e->getMessage()
            ], 500);
        }
    }

    // Tạo banner mới
    public function store(Request $request) {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
                'link' => 'nullable|url|max:500',
                'badge' => 'nullable|string|max:100',
                'position' => 'required|integer|in:0,1', // 0: hero slider, 1: banner single
                'order' => 'nullable|integer|min:0',
                'status' => 'nullable|integer|in:0,1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $imagePath = null;

            // Xử lý upload ảnh
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $uploadPath = public_path('uploads/banners');
                
                // Tạo thư mục nếu chưa tồn tại
                if (!File::exists($uploadPath)) {
                    File::makeDirectory($uploadPath, 0755, true);
                }
                
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move($uploadPath, $filename);
                $imagePath = 'uploads/banners/' . $filename;
            } elseif ($request->has('image') && is_string($request->input('image')) && $request->input('image') !== '') {
                // Hỗ trợ cả link ảnh từ URL
                $imagePath = $request->input('image');
            }

            $insertData = [
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'image' => $imagePath,
                'link' => $request->input('link'),
                'badge' => $request->input('badge'),
                'position' => $request->input('position', 0),
                'order' => $request->input('order', 0),
                'status' => $request->input('status', 1),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            $id = DB::table('banners')->insertGetId($insertData);

            // Clear cache
            Cache::forget('banners_all');
            Cache::forget('banners_position_0');
            Cache::forget('banners_position_1');

            return response()->json([
                'status' => 'success',
                'message' => 'Thêm banner thành công!',
                'data' => [
                    'id' => $id,
                    'title' => $request->input('title')
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo banner: ' . $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật banner
    public function update(Request $request, $id) {
        try {
            // Xử lý FormData - hỗ trợ cả PUT và POST request với _method=PUT
            $allData = $request->all();
            
            if ($request->method() === 'PUT' && (empty($allData) || !isset($allData['title']))) {
                $allData = array_merge($allData, $_POST ?? []);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'link' => 'nullable|url|max:500',
                'badge' => 'nullable|string|max:100',
                'position' => 'nullable|integer|in:0,1',
                'order' => 'nullable|integer|min:0',
                'status' => 'nullable|integer|in:0,1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $bannerOld = DB::table('banners')->where('id', $id)->first();
            
            if (!$bannerOld) {
                return response()->json(['status' => 'error', 'message' => 'Không tìm thấy banner'], 404);
            }

            $dataUpdate = [];

            // Chỉ cập nhật các trường có trong request
            if ($request->has('title')) {
                $dataUpdate['title'] = $request->input('title');
            }
            if ($request->has('description')) {
                $dataUpdate['description'] = $request->input('description');
            }
            if ($request->has('link')) {
                $dataUpdate['link'] = $request->input('link');
            }
            if ($request->has('badge')) {
                $dataUpdate['badge'] = $request->input('badge');
            }
            if ($request->has('position')) {
                $dataUpdate['position'] = $request->input('position');
            }
            if ($request->has('order')) {
                $dataUpdate['order'] = $request->input('order');
            }
            if ($request->has('status')) {
                $dataUpdate['status'] = $request->input('status');
            }

            // Xử lý hình ảnh
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $uploadPath = public_path('uploads/banners');
                
                if (!File::exists($uploadPath)) {
                    File::makeDirectory($uploadPath, 0755, true);
                }
                
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move($uploadPath, $filename);
                $dataUpdate['image'] = 'uploads/banners/' . $filename;

                // Xóa file cũ nếu tồn tại
                if ($bannerOld->image && File::exists(public_path($bannerOld->image)) && strpos($bannerOld->image, 'http') !== 0) {
                    File::delete(public_path($bannerOld->image));
                }
            } elseif ($request->has('image') && is_string($request->input('image')) && $request->input('image') !== '') {
                // Hỗ trợ cả link ảnh từ URL
                $dataUpdate['image'] = $request->input('image');
            }

            $dataUpdate['updated_at'] = now();

            $updated = DB::table('banners')->where('id', $id)->update($dataUpdate);

            if ($updated !== false) {
                // Clear cache
                Cache::forget('banners_all');
                Cache::forget('banners_position_0');
                Cache::forget('banners_position_1');
                
                return response()->json(['status' => 'success', 'message' => 'Cập nhật banner thành công!'], 200);
            }

            return response()->json(['status' => 'error', 'message' => 'Lỗi cập nhật'], 500);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi cập nhật banner: ' . $e->getMessage()
            ], 500);
        }
    }

    // Xóa banner
    public function destroy($id) {
        try {
            $banner = DB::table('banners')->where('id', $id)->first();
            
            if (!$banner) {
                return response()->json(['status' => 'error', 'message' => 'Không tìm thấy banner'], 404);
            }

            // Xóa file ảnh nếu tồn tại
            if ($banner->image && File::exists(public_path($banner->image)) && strpos($banner->image, 'http') !== 0) {
                File::delete(public_path($banner->image));
            }

            DB::table('banners')->where('id', $id)->delete();

            // Clear cache
            Cache::forget('banners_all');
            Cache::forget('banners_position_0');
            Cache::forget('banners_position_1');

            return response()->json(['status' => 'success', 'message' => 'Xóa banner thành công!'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi xóa banner: ' . $e->getMessage()
            ], 500);
        }
    }

    // Lấy thông tin banner theo ID
    public function show($id) {
        try {
            $banner = DB::table('banners')->where('id', $id)->first();
            
            if (!$banner) {
                return response()->json(['status' => 'error', 'message' => 'Không tìm thấy banner'], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $banner
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi lấy thông tin banner: ' . $e->getMessage()
            ], 500);
        }
    }
}
