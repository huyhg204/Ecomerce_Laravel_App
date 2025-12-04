<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

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

        $data = [
            'model' => 'gpt-4o-mini',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Bạn là chuyên gia tư vấn tại cửa hàng tạp hóa Winmart. Bạn chỉ trả lời các câu hỏi liên quan đến thực phẩm, đồ ăn, nước uống, đồ gia dụng và các hàng hóa thiết yếu. Nếu câu hỏi không đúng chủ đề, hãy lịch sự từ chối.'
                ],
                [
                    'role' => 'user',
                    'content' => $request->input('content')
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
}
