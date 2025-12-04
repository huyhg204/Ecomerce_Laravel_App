@extends('user.layout')
@section('title', 'Trang chủ')
@section('content')
    <style>
        body {
            background: #fff;
            font-family: Arial, sans-serif;
            height: 100vh;
        }
        .container{
            margin-top:100px;
            margin-bottom:100px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .auth-box {
            
            width: 380px;
            box-shadow: 0 0 10px rgba(0,0,0,0.15);
            border-radius: 10px;
            padding: 30px;
        }

        .auth-title {
            text-align: center;
            font-size: 24px;
            margin-bottom: 20px;
        }

        .auth-input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
        }

        .auth-btn {
            width: 100%;
            padding: 10px;
            background-color: #0077cc;
            border: none;
            color: white;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
        }

        .auth-toggle {
            text-align: center;
            margin-top: 15px;
        }

        .auth-toggle a {
            color: #0077cc;
            text-decoration: none;
            font-size: 14px;
        }

        .auth-error {
            color: red;
            font-size: 13px;
            margin-bottom: 10px;
        }

        .auth-success {
            color: green;
            font-size: 14px;
            text-align: center;
            margin-bottom: 10px;
        }

        .hidden { display: none; }
    </style>
    <div class="container">
        <div class="auth-box">
            @if(session('success'))
                <div class="auth-success">{{ session('success') }}</div>
            @endif
    
            {{-- Đăng nhập --}}
            <form method="POST" action="{{ route('login') }}" id="loginForm">
                @csrf
                <div class="auth-title">Đăng nhập</div>
    
                @if($errors->has('login'))
                    <div class="auth-error">{{ $errors->first('login') }}</div>
                @endif
    
                <input type="email" name="email" class="auth-input" placeholder="Email" required>
                <input type="password" name="password" class="auth-input" placeholder="Mật khẩu" required>
    
                <button type="submit" class="auth-btn">Đăng nhập</button>
    
                <div class="auth-toggle">
                    <a href="#" onclick="toggleForm('register')">Chưa có tài khoản? Đăng ký</a>
                </div>
            </form>
    
            {{-- Đăng ký --}}
            <form method="POST" action="{{ route('register') }}" id="registerForm" class="hidden">
                @csrf
                <div class="auth-title">Đăng ký</div>
    
                @if($errors->any())
                    @foreach ($errors->all() as $error)
                        <div class="auth-error">{{ $error }}</div>
                    @endforeach
                @endif
    
                <input type="text" name="name" class="auth-input" placeholder="Họ và tên" value="{{ old('name') }}" required>
                <input type="email" name="email" class="auth-input" placeholder="Email" value="{{ old('email') }}" required>
                <input type="password" name="password" class="auth-input" placeholder="Mật khẩu" required>
                <input type="password" name="password_confirmation" class="auth-input" placeholder="Xác nhận mật khẩu" required>
                <input type="text" name="address" class="auth-input" placeholder="Địa chỉ" value="{{ old('address') }}" required>
                <input type="text" name="phone" class="auth-input" placeholder="Số điện thoại" value="{{ old('phone') }}" required>
    
                <button type="submit" class="auth-btn">Đăng ký</button>
    
                <div class="auth-toggle">
                    <a href="#" onclick="toggleForm('login')">Đã có tài khoản? Đăng nhập</a>
                </div>
            </form>
        </div>
    </div>
 

    <script>
        function toggleForm(form) {
            document.getElementById('loginForm').classList.toggle('hidden', form !== 'login');
            document.getElementById('registerForm').classList.toggle('hidden', form !== 'register');
        }
    </script>
    @endsection