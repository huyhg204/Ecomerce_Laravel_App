<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trang Quản Trị - @yield('title')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        /* CSS riêng */
        .admin-sidebar {
            width: 250px;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            background-color: #343a40;
            color: #fff;
            padding-top: 60px;
        }
        .admin-sidebar a {
            color: #fff;
            padding: 10px 20px;
            display: block;
            text-decoration: none;
        }
        .admin-sidebar a:hover {
            background-color: #495057;
        }
        .admin-content {
            margin-left: 250px;
            padding: 20px;
            min-height: 100vh;
            background-color: #f8f9fa;
        }
    </style>

    @stack('styles') {{-- Nếu sau này từng trang cần thêm CSS riêng --}}
</head>
<body>

    <!-- Sidebar -->
    <div class="admin-sidebar">
        <h4 class="text-center mb-4">Quản Trị</h4>
        <a href="{{ route('admin.category.index')}}">Quản lý Danh mục</a>
        <a href="{{ route('admin.product.index')}}">Quản lý Sản phẩm</a>
        <a href="{{ route('admin.order.index')}}">Quản lý Đơn hàng</a>
        <a href="{{ route('admin.user.index')}}">Quản lý Người dùng</a>
        <a href="{{ route('admin.revenue.index')}}">Quản lý Doanh thu</a>
        <a 
                                onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                Đăng xuất
                            </a>

                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                @csrf
                            </form>
    </div>

    <!-- Content -->
    <div class="admin-content">
        <h2>@yield('page-title')</h2>
        @yield('content')
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts') {{-- Nếu sau này từng trang cần thêm JS riêng --}}
</body>
</html>
