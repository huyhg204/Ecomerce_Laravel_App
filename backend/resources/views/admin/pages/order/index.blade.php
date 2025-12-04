@extends('admin.layout')

@section('title', 'Danh sách đơn hàng')
@section('page-title', 'Danh sách đơn hàng')

@section('content')
<table class="table table-bordered">
    <thead>
        <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Tên người nhận</th>
            <th>Phone</th>
            <th>Địa chỉ</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Trạng thái đơn</th>
            <th>Trạng thái giao hàng</th>
            <th>Hành động</th>
        </tr>
    </thead>
    <tbody>
        @foreach($orders as $index => $order)
        <tr>
            <td>{{ ++$index }}</td>
            <td>{{ $order->user_name ?? 'Khách vãng lai' }}</td>
            <td>{{ $order->name_customer }}</td>
            <td>{{ $order->phone_customer }}</td>
            <td>{{ $order->address_customer }}</td>
            <td>{{ number_format($order->total_order) }} đ</td>
            <td>{{ $order->date_order }}</td>
            <td>
                <form action="{{ route('admin.order.updateStatus', $order->id) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <select name="status_order" class="form-control">
                        <option value="0" {{ $order->status_order == 0 ? 'selected' : '' }}>Chờ xử lý</option>
                        <option value="1" {{ $order->status_order == 1 ? 'selected' : '' }}>Đang xử lý</option>
                        <option value="2" {{ $order->status_order == 2 ? 'selected' : '' }}>Hoàn thành</option>
                    </select>
                    <button type="submit" class="btn btn-sm btn-success mt-2">Lưu</button>
                </form>
            </td>
            <td>
                <form action="{{ route('admin.order.updateDeliveryStatus', $order->id) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <select name="status_delivery" class="form-control">
                        <option value="0" {{ $order->status_delivery == 0 ? 'selected' : '' }}>Đang chuẩn bị</option>
                        <option value="1" {{ $order->status_delivery == 1 ? 'selected' : '' }}>Đang giao</option>
                        <option value="2" {{ $order->status_delivery == 2 ? 'selected' : '' }}>Đã giao</option>
                    </select>
                    <button type="submit" class="btn btn-sm btn-success mt-2">Lưu</button>
                </form>
            </td>
            <td>
                <a href="{{ route('admin.order.show', $order->id) }}" class="btn btn-sm btn-info">Chi tiết</a>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endsection
