@extends('admin.layout')

@section('title', 'Thêm Danh mục')
@section('page-title', 'Thêm Danh mục')

@section('content')
    <form action="{{ route('admin.category.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="name" class="form-label">Tên Danh mục</label>
            <input type="text" class="form-control" id="name" name="name_category" placeholder="Nhập tên danh mục" required>
        </div>
        <div class="mb-3">
            <label for="" class="form-label">Link ảnh Danh mục</label>
            <input type="text" class="form-control" id="" name="image_category" placeholder="Nhập link ảnh danh mục" required>
        </div>
        <button type="submit" class="btn btn-primary">Tạo mới</button>
    </form>
@endsection
