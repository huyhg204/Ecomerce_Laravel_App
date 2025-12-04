<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ParsePutFormData
{
    /**
     * Handle an incoming request.
     * Parse FormData từ PUT request vì PHP không tự động parse multipart/form-data với PUT
     */
    public function handle(Request $request, Closure $next)
    {
        // Chỉ xử lý PUT/PATCH request với Content-Type là multipart/form-data
        if (in_array($request->method(), ['PUT', 'PATCH']) && 
            str_contains($request->header('Content-Type', ''), 'multipart/form-data')) {
            
            // Nếu có dữ liệu trong $_POST (một số server có thể parse PUT FormData vào $_POST), sử dụng nó
            if (!empty($_POST)) {
                foreach ($_POST as $key => $value) {
                    if (!$request->has($key)) {
                        $request->merge([$key => $value]);
                    }
                }
            }
            
            // Nếu vẫn thiếu dữ liệu quan trọng, thử đọc từ input stream
            if (empty($request->input('name_product')) && empty($request->input('category_id'))) {
                $input = file_get_contents('php://input');
                
                if (!empty($input)) {
                    // Parse boundary từ Content-Type header
                    $contentType = $request->header('Content-Type', '');
                    preg_match('/boundary=(.*)$/is', $contentType, $matches);
                    
                    if (!empty($matches[1])) {
                        $boundary = trim($matches[1]);
                        $parts = explode('--' . $boundary, $input);
                        
                        foreach ($parts as $part) {
                            // Bỏ qua phần đầu và cuối
                            if (trim($part) === '' || trim($part) === '--') {
                                continue;
                            }
                            
                            // Tìm field name
                            if (preg_match('/name="([^"]+)"/', $part, $nameMatch)) {
                                $fieldName = $nameMatch[1];
                                
                                // Tìm giá trị (sau header CRLFCRLF)
                                $valueStart = strpos($part, "\r\n\r\n");
                                if ($valueStart !== false) {
                                    $value = substr($part, $valueStart + 4);
                                    // Loại bỏ CRLF ở cuối
                                    $value = rtrim($value, "\r\n");
                                    
                                    // Chỉ merge nếu chưa có trong request
                                    if (!$request->has($fieldName) && $value !== '') {
                                        $request->merge([$fieldName => $value]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return $next($request);
    }
}

