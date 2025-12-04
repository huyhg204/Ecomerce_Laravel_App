@extends('admin.layout')

@section('title', 'Danh sách sản phẩm')

@section('page-title', 'Danh sách sản phẩm')

@section('content')
<a href="{{ route('admin.product.create')}}" class="btn btn-sm btn-primary">Thêm mới</a>
    <div class="table-responsive mt-5">
        <table class="table table-striped">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Danh mục</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                @foreach ( $products as $index => $item )
                <tr>
                    <td>{{++$index}}</td>
                    <td><img src="{{$item->image_product}}" width="20%" height="100px" alt="" srcset=""></td>
                    <td>{{$item->name_product}}</td>
                    <td>{{number_format($item->price_product, 0, ',', '.') . ' ₫'}}</td>
                    <td>{{$item->name_category}}</td>
                    <td>
                        <a href="{{ route('admin.product.edit', ['id' => $item->id]) }}" class="btn btn-sm btn-primary">Sửa</a>
                        @if ($item->status_product==0)
                        <a href="{{ route('admin.product.destroy', ['id' => $item->id]) }}" class="btn btn-sm btn-danger">Ẩn</a>
                        @else
                        <a href="{{ route('admin.product.restore', ['id' => $item->id]) }}" class="btn btn-sm btn-success">Hiện</a>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
