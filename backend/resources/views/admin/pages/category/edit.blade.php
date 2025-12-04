@extends('admin.layout')

@section('title', 'Chỉnh sửa Danh mục')
@section('page-title', 'Chỉnh sửa Danh mục')

@section('content')
    <form action="{{ route('admin.category.update', $category->id) }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="" class="form-label">Tên Danh mục</label>
            <input type="text" class="form-control" value="{{$category->name_category}}" name="name_category" placeholder="Nhập tên danh mục" required>
        </div>
        <div class="mb-3">
            <label for="" class="form-label">Link ảnh Danh mục</label>
            <input type="text" class="form-control" value="{{$category->image_category}}" name="image_category" placeholder="Nhập link ảnh danh mục" required>
            <img width="20%" src="{{$category->image_category}}" alt="">
        </div>
        <button type="submit" class="btn btn-primary">Cập nhật</button>
    </form>
@endsection
