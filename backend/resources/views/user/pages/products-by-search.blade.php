@extends('user.layout')
@section('title', 'Trang chủ')
@section('content')
<style>
    /* CSS riêng tránh trùng Bootstrap 5 */
    .category-title-custom {
        font-size: 2rem;
        font-weight: bold;
        color: #333;
    }

    .product-item-custom {
        transition: transform 0.3s, box-shadow 0.3s;
        border: 1px solid #eee;
        border-radius: 10px;
        overflow: hidden;
    }

    .product-item-custom:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }

    .product-item-custom img {
        object-fit: cover;
        height: 250px;
    }
</style>
<div class="container my-5">
    <h1 class="category-title-custom mb-4 text-center">
        Danh sách sản phẩm liên quan đến từ khóa "{{ $name}}"
    </h1>

    <div class="row">
        @foreach ($products as $product)
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="product-item">
                    <figure>
                      <a href="/product/{{ $product->id}}" title="Product Title">
                        <img width="100%" src="{{ $product->image_product ?? 'https://via.placeholder.com/300x300?text=No+Image' }}"  class="tab-image">
                      </a>
                    </figure>
                    <h3>{{ $product->name_product }}</h3>
                    <span class="qty">1 phần
                    <span class="price">{{  number_format($product->price_product, 0, ',', '.') . ' ₫'}}</span>
                  </div>
            </div>
        @endforeach
    </div>
</div>
@endsection