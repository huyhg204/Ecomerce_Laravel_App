<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã OTP đặt lại mật khẩu</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1976d2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #e0e0e0;
        }
        .otp-box {
            background-color: white;
            padding: 30px;
            margin: 20px 0;
            border-radius: 10px;
            text-align: center;
            border: 2px solid #1976d2;
        }
        .otp-code {
            font-size: 3rem;
            font-weight: bold;
            color: #1976d2;
            letter-spacing: 10px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
        }
        .warning {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Đặt lại mật khẩu</h1>
    </div>
    
    <div class="content">
        <p>Xin chào <strong>{{ $user_name }}</strong>,</p>
        
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP bên dưới để xác thực:</p>
        
        <div class="otp-box">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 1.2rem;">Mã OTP của bạn:</p>
            <div class="otp-code">{{ $otp }}</div>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 1.1rem;">Mã này sẽ hết hạn sau {{ $expires_in }} phút</p>
        </div>
        
        <div class="warning">
            <p style="margin: 0; color: #856404;">
                <strong>⚠️ Lưu ý bảo mật:</strong>
            </p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #856404;">
                <li>Không chia sẻ mã OTP này với bất kỳ ai</li>
                <li>Mã OTP chỉ có hiệu lực trong {{ $expires_in }} phút</li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
            </ul>
        </div>
        
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.</p>
    </div>
    
    <div class="footer">
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.</p>
    </div>
</body>
</html>
