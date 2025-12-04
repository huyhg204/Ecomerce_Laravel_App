@extends('admin.layout')

@section('title', 'Chi tiết đơn hàng')
@section('page-title', 'Chi tiết đơn hàng MDH_'.$order->id)

@section('content')
<div class="mb-3">
    <h5>Thông tin khách hàng</h5>
    <p><strong>Tên:</strong> {{ $order->name_customer }}</p>
    <p><strong>Số điện thoại:</strong> {{ $order->phone_customer }}</p>
    <p><strong>Địa chỉ:</strong> {{ $order->address_customer }}</p>
    <p><strong>Ghi chú:</strong> {{ $order->note_customer }}</p>
</div>

<div class="mb-3">
    <h5>Thông tin đơn hàng</h5>
    <p><strong>Tổng tiền:</strong> {{ number_format($order->total_order) }} đ</p>
    <p><strong>Ngày đặt:</strong> {{ $order->date_order }}</p>
    <p><strong>Phương thức thanh toán:</strong> {{ $order->method_pay == 0 ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng' }}</p>
</div>

@if($orderDetails->count())
<table class="table table-bordered">
    <thead>
        <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
        </tr>
    </thead>
    <tbody>
        @foreach($orderDetails as $item)
        <tr>
            <td>{{ $item->name_product }}</td>
            <td>{{ $item->quantity_detail }}</td>
            <td>{{ number_format($item->total_detail) }} đ</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endif
@endsection
