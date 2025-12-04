@extends('admin.layout')

@section('title', 'Quản lý Doanh Thu')
@section('page-title', 'Quản lý Doanh Thu')

@section('content')
<div class="row">
    <div class="col-md-12">
        <form action="{{ route('admin.revenue.index') }}" method="GET">
            <div class="form-group">
                <label for="search_date">Chọn thời gian:</label>
                <div class="input-group">
                    <input type="date" name="date" class="form-control" id="search_date">
                    <select name="time_period" class="form-control">
                        <option value="day" {{ request('time_period') == 'day' ? 'selected' : '' }}>Ngày</option>
                        <option value="month" {{ request('time_period') == 'month' ? 'selected' : '' }}>Tháng</option>
                        <option value="year" {{ request('time_period') == 'year' ? 'selected' : '' }}>Năm</option>
                    </select>
                    <button type="submit" class="btn btn-primary">Tìm kiếm</button>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="row mt-4">
    <div class="col-md-12">
        <h3>Tổng Doanh Thu</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Số đơn hàng</th>
                    <th>Tổng doanh thu</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $totalOrders }}</td>
                    <td>{{ number_format($totalRevenue) }} đ</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="col-md-12 mt-4">
        <h3>Top 5 Sản Phẩm Bán Chạy</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng bán</th>
                </tr>
            </thead>
            <tbody>
                @foreach($topProducts as $product)
                <tr>
                    <td>{{ $product->name_product }}</td>
                    <td>{{ $product->quantity_sold }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
