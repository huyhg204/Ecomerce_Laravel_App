@extends('admin.layout')

@section('title', 'Danh sách Danh mục')

@section('page-title', 'Danh sách Danh mục')

@section('content')
<a href="{{ route('admin.category.create')}}" class="btn btn-sm btn-primary">Thêm mới</a>
    <div class="table-responsive mt-5">
        <table class="table table-striped">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Ảnh danh mục</th>
                    <th>Tên danh mục</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($categoryAll as $index => $item)
                <tr>
                    <td>{{++$index}}</td>
                    <td><img src="{{$item->image_category}}" width="20%" height="100px" alt="" srcset=""></td>
                    <td>{{$item->name_category}}</td>
                    <td>
                        <a href="{{ route('admin.category.edit', ['id' => $item->id]) }}" class="btn btn-sm btn-primary">Sửa</a>
                        @if ($item->status_category==0)
                        <a href="{{ route('admin.category.destroy', ['id' => $item->id]) }}" class="btn btn-sm btn-danger">Ẩn</a>
                        @else
                        <a href="{{ route('admin.category.restore', ['id' => $item->id]) }}" class="btn btn-sm btn-success">Hiện</a>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
