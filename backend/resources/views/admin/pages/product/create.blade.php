@extends('admin.layout')

@section('title', 'Thêm Danh mục')
@section('page-title', 'Thêm Danh mục')

@section('content')
    <form action="{{ route('admin.product.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="" class="form-label">Tên sản phẩm</label>
            <input type="text" class="form-control" name="name_product" placeholder="Nhập tên sản phẩm" required>
        </div>
        <div class="mb-3">
            <label for="" class="form-label">Ảnh sản phẩm</label>
            <input type="text" class="form-control" name="image_product" placeholder="Nhập link ảnh sản phẩm" required>
        </div>
        <div class="mb-3">
            <label for="" class="form-label">Mô tả</label>
            <textarea class="form-control" name="description_product" placeholder="Mô tả" required></textarea>
        </div>
        <div class="mb-3">
            <label for="" class="form-label">Giá sản phẩm</label>
            <input type="number" class="form-control" name="price_product" min="0" placeholder="Nhập giá" required>
        </div>
        <div class="mb-3">
            <label for="" class="form-label">Danh mục</label>
            <select name="category_id"  class="form-control" id="">
                @foreach ($categoryAll as $item)
                    <option value="{{$item->id}}">{{$item->name_category}}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Tạo mới</button>
    </form>
@endsection
