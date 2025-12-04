@extends('user.layout')
@section('title', 'Trang chủ')
@section('content')
    <style>
        /* Khung chat tổng */
        .chat-container {
            max-width: 800px;
            margin: 50px auto;
            background-color: #FFC43F;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Tiêu đề */
        .chat-title {
            text-align: center;
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        }

        /* Khung nhập tin nhắn */
        .chat-input {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
        }

        /* Nút gửi */
        .chat-send-btn {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            color: #fff;
            background-color: #007BFF;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        .chat-send-btn:hover {
            background-color: #0056b3;
        }

        /* Khung nhận phản hồi */
        .chat-response {
            margin-top: 20px;
            min-height: 150px;
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 6px;
            border: 1px solid #ccc;
            font-size: 16px;
            color: #333;
            overflow-y: auto;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>

<div class="chat-container">
    <h1 class="chat-title">Tư vấn viên AI của chúng tôi!</h1>

    <input type="text" class="chat-input" id="user-message" placeholder="Nhập câu hỏi của bạn...">

    <button class="chat-send-btn" onclick="sendMessage()">Gửi câu hỏi</button>

    <div class="chat-response" id="response"></div>
</div>

<script>
    function sendMessage() {
        let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const userMessage = document.getElementById("user-message").value.trim();
        
        if (!userMessage) {
            alert('Vui lòng nhập câu hỏi!');
            return;
        }

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({ content: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("response").innerText = data.message;
        })
        .catch(error => {
            console.error('Lỗi:', error);
            document.getElementById("response").innerText = 'Có lỗi xảy ra khi gửi câu hỏi!';
        });
    }
</script>
@endsection