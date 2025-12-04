@extends('user.layout')
@section('title', 'Trang chủ')
@section('content')

<style>
    /* Giỏ hàng */
    .cart-item {
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .cart-item img {
        width: 100px;
        height: 100px;
    }

    .cart-item button {
        width: 80px;
    }

    .cart-summary {
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    .cart-summary button {
        width: 100%;
    }
    #order-form input{
        border: 1px solid black;
    }
    #order-form select{
        border: 1px solid black;
    }
    #order-form textarea{
        border: 1px solid black;
    }
</style>
<div class="container">
    <h1 class="mb-4">Giỏ Hàng</h1>
    
    <!-- Alert -->
    <div class="alert alert-danger alert-dismissible fade show" id="cart-error-alert" role="alert" style="display: none;">
        <strong>Lỗi!</strong> Thêm sản phẩm vào giỏ hàng thất bại.
    </div>
    <div class="alert alert-warning alert-dismissible fade show" id="cart-stock-alert" role="alert" style="display: none;">
        <strong>Thông báo:</strong> Giỏ hàng của bạn có sản phẩm trong kho không đủ. Chúng tôi đã cập nhật lại giỏ hàng khả dụng để đặt hàng.
    </div>

    <div class="row">
        <!-- Giỏ hàng trái -->
        <div class="col-md-8">
            @if (empty($cart))
    <p>Giỏ hàng của bạn đang trống.</p>
@else
            <div class="cart-items">
                @foreach ($cart as $item)
                @php
                $total+=$item['total_item'];
                @endphp
        <div class="cart-item d-flex align-items-center justify-content-between mb-3 p-3 border rounded">
            <a style="text-decoration:none" href="/product/{{ $item['product_id'] }}">
            <img src="{{ $item['image_product'] }}" alt="Product Image" class="img-thumbnail" style="width: 100px; height: 100px;">
    </a>
            <div class="product-details">
                <h5>{{ $item['name_product'] }}</h5>
                <p>Đơn giá: {{ number_format($item['price_product'], 0, ',', '.') }} VND</p>
                <p>Số lượng: <input type="number" value="{{ $item['quantity_item'] }}" class="form-control" style="width: 60px;" disabled></p>
                <p>Tổng tiền: {{ number_format($item['total_item'], 0, ',', '.') }} VND</p>
            </div>
            <form action="{{ route('removeFromCart') }}" method="POST">
                @csrf
                <input type="number" name="product_id" value="{{ $item['product_id'] }}" required hidden>
            <button class="btn btn-danger btn-sm remove-item" type="submit">Xóa</button>
            </form>
        </div>
    @endforeach
            </div>
            @endif
            
            @if (session('success'))
            <div class="alert alert-success mt-3">
                {!! session('success') !!}
            </div>
        @endif
        
        @if (session('error'))
            <div class="alert alert-danger mt-3">
                {{ session('error') }}
            </div>
        @endif
        </div>

        <!-- Giỏ hàng phải -->
        <div class="col-md-4">
            <div class="cart-summary p-3 border rounded">
                <h4>Tổng Giỏ Hàng</h4>
                <p>Tổng loại sản phẩm: {{count($cart)}}</p>
                <p>Tổng tiền: {{ number_format($total, 0, ',', '.') }} VND</p>

                <h5>Thông Tin Khách Hàng</h5>
                <form action="" method="post" id="order-form">
                    @csrf
                    <div class="mb-3">
                        <label for="name" class="form-label">Tên khách hàng</label>
                        <input type="text" value="{{ Auth::user()->name ?? '' }}" name="name_customer" class="form-control" id="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="phone" class="form-label">Số điện thoại</label>
                        <input type="text" value="{{ Auth::user()->phone ?? '' }}" name="phone_customer" class="form-control" id="phone" required>
                    </div>
                    <div class="mb-3">
                        <label for="address" class="form-label">Địa chỉ</label>
                        <input type="text" value="{{ Auth::user()->address ?? '' }}" name="address_customer" class="form-control" id="address" required>
                    </div>
                    <div class="mb-3">
                        <label for="address" class="form-label">Ghi chú</label>
                        <textarea name="note_customer" class="form-control"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="address" class="form-label">Phương thức thanh toán</label>
                        <select name="method_pay" class="form-control" required id="">
                            <option value="0">Thanh toán khi giao hàng</option>
                            <option value="1">Chuyển khoản</option>
                        </select>
                    </div>
                    @if (count($cart)>0)
                    <button type="submit" class="btn btn-primary w-100" id="place-order">Đặt hàng</button>
                    @else
                    <button class="btn btn-danger w-100" id="place-order" disabled>Giỏ hàng trống</button>
                    @endif
                </form>
            </div>
        </div>
    </div>
</div>


    


    @endsection