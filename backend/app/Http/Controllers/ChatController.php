<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        $client = new Client();

        // Lấy API Key từ .env (Hãy thêm OPENAI_API_KEY=sk-... vào file .env của bạn)
        // Hoặc nếu test nhanh thì điền trực tiếp, nhưng không khuyến khích.
        $apiKey = env('OPENAI_API_KEY');
        
        if (!$apiKey) {
            return response()->json([
                'status' => 'error',
                'message' => 'OpenAI API key chưa được cấu hình. Vui lòng thêm OPENAI_API_KEY vào file .env'
            ], 500);
        }

        // Nhận cả 'message' (từ frontend React) và 'content' (từ blade template)
        $userMessage = $request->input('message') ?? $request->input('content');
        
        if (!$userMessage || trim($userMessage) === '') {
            return response()->json([
                'status' => 'error',
                'message' => 'Nội dung tin nhắn không được để trống.'
            ], 400);
        }

        // Phát hiện nếu người dùng hỏi về sản phẩm và tìm kiếm sản phẩm thực tế
        $productsInfo = $this->getRelevantProducts($userMessage);

        // Xây dựng system prompt với thông tin sản phẩm
        $systemPrompt = 'Bạn là chuyên gia tư vấn bán hàng tại cửa hàng thời trang Exclusive - một nền tảng mua sắm trực tuyến chuyên về thời trang và phụ kiện. Bạn giúp khách hàng tìm kiếm và tư vấn về các sản phẩm như: quần áo, giày dép, túi xách, phụ kiện thời trang, đồ thể thao, đồng hồ, kính mắt và các sản phẩm thời trang khác. Bạn nhiệt tình, thân thiện và luôn sẵn sàng hỗ trợ khách hàng tìm được sản phẩm phù hợp.';
        
        if (!empty($productsInfo)) {
            $systemPrompt .= "\n\nDưới đây là danh sách sản phẩm có trong cửa hàng liên quan đến câu hỏi của khách hàng:\n" . $productsInfo;
            $systemPrompt .= "\n\nHãy sử dụng thông tin sản phẩm trên để gợi ý cụ thể cho khách hàng. Nếu có nhiều sản phẩm, hãy liệt kê 3-5 sản phẩm phù hợp nhất với tên, giá và mô tả ngắn gọn. Luôn đề cập đến giá cả và đặc điểm nổi bật của sản phẩm.";
        } else {
            $systemPrompt .= "\n\nNếu khách hỏi về sản phẩm cụ thể mà bạn không có thông tin trong danh sách trên, hãy hướng dẫn họ cách tìm kiếm trên website bằng thanh tìm kiếm hoặc duyệt theo danh mục.";
        }

        $data = [
            'model' => 'gpt-4o-mini',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => $systemPrompt
                ],
                [
                    'role' => 'user',
                    'content' => trim($userMessage)
                ]
            ]
        ];

        try {
            $response = $client->post('https://api.openai.com/v1/chat/completions', [
                'json' => $data,
                'headers' => [
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json'
                ]
            ]);

            $body = $response->getBody();
            $data = json_decode($body, true);

            return response()->json([
                'status' => 'success',
                'message' => $data['choices'][0]['message']['content'] ?? 'Xin lỗi, tôi không thể trả lời lúc này.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi kết nối OpenAI',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tìm kiếm sản phẩm liên quan dựa trên tin nhắn của người dùng
     */
    private function getRelevantProducts($userMessage)
    {
        // Từ khóa để phát hiện người dùng hỏi về sản phẩm
        $productKeywords = ['tìm', 'gợi ý', 'có', 'shop', 'cửa hàng', 'sản phẩm', 'mua', 'bán', 'giá', 'đồ', 'áo', 'quần', 'giày', 'túi', 'phụ kiện'];
        
        $lowerMessage = mb_strtolower($userMessage, 'UTF-8');
        $isProductQuery = false;
        
        foreach ($productKeywords as $keyword) {
            if (mb_strpos($lowerMessage, $keyword, 0, 'UTF-8') !== false) {
                $isProductQuery = true;
                break;
            }
        }
        
        if (!$isProductQuery) {
            return '';
        }

        // Trích xuất từ khóa tìm kiếm từ tin nhắn
        $searchTerms = $this->extractSearchTerms($userMessage);
        
        if (empty($searchTerms)) {
            // Nếu không tìm thấy từ khóa cụ thể, lấy sản phẩm mới nhất
            $products = DB::table('products')
                ->where('status_product', 0)
                ->orderBy('id', 'desc')
                ->limit(5)
                ->get();
        } else {
            // Tìm kiếm sản phẩm theo từ khóa
            $searchTerm = '%' . implode('%', $searchTerms) . '%';
            $products = DB::table('products')
                ->leftJoin('categories_product', 'products.category_id', '=', 'categories_product.id')
                ->where('products.status_product', 0)
                ->where(function($query) use ($searchTerm, $searchTerms) {
                    foreach ($searchTerms as $term) {
                        $query->orWhere('products.name_product', 'like', '%' . $term . '%')
                              ->orWhere('products.description_product', 'like', '%' . $term . '%')
                              ->orWhere('categories_product.name_category', 'like', '%' . $term . '%');
                    }
                })
                ->select('products.*', 'categories_product.name_category')
                ->orderByDesc('products.id')
                ->limit(10)
                ->get();
        }

        if ($products->isEmpty()) {
            return '';
        }

        // Format thông tin sản phẩm để đưa vào prompt
        $productsText = "Danh sách sản phẩm:\n";
        foreach ($products as $index => $product) {
            $actualPrice = $product->discount_price ?? $product->original_price;
            $price = number_format($actualPrice, 0, ',', '.') . '₫';
            $productsText .= ($index + 1) . ". " . $product->name_product;
            if (isset($product->name_category)) {
                $productsText .= " (Danh mục: " . $product->name_category . ")";
            }
            $productsText .= " - Giá: " . $price;
            if (!empty($product->description_product)) {
                $description = mb_substr(strip_tags($product->description_product), 0, 100, 'UTF-8');
                if (mb_strlen($product->description_product, 'UTF-8') > 100) {
                    $description .= '...';
                }
                $productsText .= " - Mô tả: " . $description;
            }
            $productsText .= "\n";
        }

        return $productsText;
    }

    /**
     * Trích xuất từ khóa tìm kiếm từ tin nhắn người dùng
     */
    private function extractSearchTerms($message)
    {
        // Loại bỏ các từ không cần thiết
        $stopWords = ['tìm', 'gợi ý', 'cho', 'tôi', 'về', 'có', 'ở', 'shop', 'cửa hàng', 'sản phẩm', 'mua', 'bán', 'giá', 'và', 'các', 'bộ', 'một', 'vài', 'những', 'nào', 'gì'];
        
        // Từ ghép thường gặp (ưu tiên tìm trước)
        $compoundWords = ['thể thao', 'quần áo', 'giày dép', 'túi xách', 'áo khoác', 'áo thun', 'quần jean', 'quần short', 'áo sơ mi', 'váy đầm', 'đồng hồ', 'kính mắt', 'phụ kiện'];
        
        $lowerMessage = mb_strtolower($message, 'UTF-8');
        $terms = [];
        
        // Tìm từ ghép trước
        foreach ($compoundWords as $compound) {
            if (mb_strpos($lowerMessage, $compound, 0, 'UTF-8') !== false) {
                $terms[] = $compound;
                // Loại bỏ từ ghép đã tìm thấy khỏi message để tránh trùng lặp
                $lowerMessage = str_replace($compound, '', $lowerMessage);
            }
        }
        
        // Tìm các từ đơn
        $words = preg_split('/[\s,]+/u', $lowerMessage);
        foreach ($words as $word) {
            $word = trim($word);
            if (!empty($word) && mb_strlen($word, 'UTF-8') >= 2 && !in_array($word, $stopWords)) {
                // Không thêm nếu đã có trong từ ghép
                $isInCompound = false;
                foreach ($terms as $term) {
                    if (mb_strpos($term, $word, 0, 'UTF-8') !== false) {
                        $isInCompound = true;
                        break;
                    }
                }
                if (!$isInCompound) {
                    $terms[] = $word;
                }
            }
        }
        
        return array_slice($terms, 0, 3); // Lấy tối đa 3 từ khóa
    }
}
