@extends('user.layout')
@section('title', 'Trang chủ')
@section('content')
<style>
    /* Định dạng ảnh sản phẩm */
.product-detail-img {
  max-height: 400px;
  object-fit: contain;
}

/* Định dạng tên sản phẩm */
.product-detail-title {
  font-size: 1.75rem;
  font-weight: 600;
}

/* Mô tả sản phẩm */
.product-detail-description {
  font-size: 1rem;
  color: #555;
}

</style>
<form action="{{ route('addToCart') }}" method="post">
  <div class="container py-5">
    <div class="row">
      <div class="col-md-5 text-center">
        <img src="{{$product->image_product}}" alt="Ảnh sản phẩm" class="img-fluid product-detail-img">
      </div>

      <div class="col-md-7">
        <h2 class="product-detail-title">{{$product->name_product}}</h2>
        <p class="text-muted">Danh mục: <span class="fw-semibold">{{$product->name_category}}</span></p>
        <p class="product-detail-description">{{$product->description_product}}</p>
        <p style="color: red" class="fs-5 fw-bold">Giá: <span  class="product-detail-price">{{number_format($product->price_product, 0, ',', '.') . ' ₫'}}</span></p>
        <p>Số lượng còn lại: <span class="product-detail-available">{{$product->quantity_product}} ( Phần )</span></p>

        <div class="mb-3">
          <label for="quantityInput" class="form-label">Chọn số lượng</label>
          <input type="number" name="quantity_item" style="border:1px solid black" id="quantityInput" class="form-control w-25" min="1" max="{{$product->quantity_product}}" step="1" value="1">
        </div>
              @if ($product->quantity_product>0)
                @csrf
                <input type="text" name="product_id" value="{{$product->id}}" hidden required>
        <button id="addToCartBtn" class="btn btn-primary">Thêm vào giỏ hàng</button>
                  
              @else
        <button  class="btn btn-danger" disabled>Sản phẩm hết hàng</button>
                  
              @endif

              @if (session('success'))
              <div class="alert alert-success mt-3">
                  {{ session('success') }}
              </div>
          @endif
          
          @if (session('error'))
              <div class="alert alert-danger mt-3">
                  {{ session('error') }}
              </div>
          @endif
      </div>
    </div>
  </div>
</form>

  {{-- <script>
    const availableQty = 10;
    const qtyInput = document.getElementById('quantityInput');
    const btnAddToCart = document.getElementById('addToCartBtn');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');

    if (availableQty > 0) {
      btnAddToCart.disabled = false;
    }

    btnAddToCart.addEventListener('click', function () {
      const requestedQty = parseInt(qtyInput.value) || 0;

      // Reset alert
      successAlert.classList.add('d-none');
      errorAlert.classList.add('d-none');

      if (requestedQty > 0 && requestedQty <= availableQty) {
        successAlert.classList.remove('d-none');
      } else {
        errorAlert.classList.remove('d-none');
      }
    });
  </script> --}}
@endsection
