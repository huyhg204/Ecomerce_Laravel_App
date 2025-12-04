@extends('user.layout')
@section('title', 'Trang chủ')
@section('content')
    <style>
        .track-order-popup,
        .track-order-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1050;
        }

        .track-order-overlay {
            background: rgba(0, 0, 0, 0.5);
            z-index: 1;
        }

        .track-order-popup {
            height: 100%;
            justify-content: center;
            align-items: center;
        }

        .track-order-popup-content {
            height: 70%;
            overflow-y: scroll;
            background: #fff;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            position: relative;
            z-index: 1060;
        }

        .track-order-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #aaa;
        }

        .track-order-close:hover {
            color: #333;
        }
    </style>
    <div class="container my-5">
        <h2 class="mb-4">Tra cứu đơn hàng</h2>

        <form id="form-track-order" class="track-order-form">
            <div class="mb-3">
                <input type="text" class="form-control track-order-input" id="order_code" name="order_code"
                    placeholder="Nhập mã đơn hàng (ví dụ: MDH_123)" required>
            </div>
            <button type="submit" class="btn btn-primary track-order-btn">Tìm kiếm</button>
        </form>
    </div>
    @if (session('error'))
        <div class="alert alert-danger mt-3">
            {{ session('error') }}
        </div>
    @endif
    <div id="track-order-popup" class="track-order-popup">
        <div class="track-order-popup-content">
            <span class="track-order-close">&times;</span>
            <h4>Thông tin đơn hàng</h4>
            <div id="track-order-result">
                <!-- Dữ liệu đơn hàng sẽ được gắn vào đây -->
            </div>
        </div>
    </div>

    <div id="track-order-overlay" class="track-order-overlay"></div>
    <script>
        function getPaymentMethod(method) {
            switch (method) {
                case 0:
                    return 'POD (Thanh toán khi nhận hàng)';
                case 1:
                    return 'Banking (Chuyển khoản ngân hàng)';
                default:
                    return 'Không xác định';
            }
        }

        function getDeliveryStatus(status) {
            switch (status) {
                case 0:
                    return 'Chờ giao';
                case 1:
                    return 'Đang giao';
                case 2:
                    return 'Đã giao';
                default:
                    return 'Không xác định';
            }
        }

        function getOrderStatus(status) {
            switch (status) {
                case 0:
                    return 'Đang chờ xử lý';
                case 1:
                    return 'Đang xử lý';
                case 2:
                    return 'Đã hoàn thành';
                default:
                    return 'Không xác định';
            }
        }
        document.getElementById('form-track-order').addEventListener('submit', function (e) {
            e.preventDefault();
            let orderCode = document.getElementById('order_code').value.trim();

            if (!orderCode) return;
            fetch('/api/search-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    order_code: orderCode
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const formatCurrency = (amount) => {
                        return new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(amount);
                    };

                    if (data.status === 'success') {
                        let resultHtml = '';
                        resultHtml += `
                                    <div class="order-item">
                                        <p><strong>Mã đơn:</strong> MDH_${data.data.order_info.order_id}</p>
                                        <p><strong>Tên khách:</strong> ${data.data.order_info.name_customer}</p>
                                        <p><strong>Số điện thoại:</strong> ${data.data.order_info.phone_customer}</p>
                                        <p><strong>Địa chỉ:</strong> ${data.data.order_info.address_customer}</p>
                                        <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethod(data.data.order_info.method_pay)}</p>
                                        <p><strong>Trạng thái giao hàng:</strong> ${getDeliveryStatus(data.data.order_info.status_delivery)}</p>
                                        <p><strong>Trạng thái đơn hàng:</strong> ${getOrderStatus(data.data.order_info.status_order)}</p>
                                        <hr>
                                `;
                        data.data.products.forEach(item => {
                            resultHtml += `
                                        <img src="${item.image_product}" alt="${item.name_product}" style="width: 100px;">
                                        <p><strong>Sản phẩm:</strong> ${item.name_product}</p>
                                        <p><strong>Số lượng:</strong> ${item.quantity_detail}</p>
                                        <p><strong>Tổng tiền món:</strong> ${formatCurrency(item.total_detail)}</p>
                                        <hr>
                                `;
                        });
                        resultHtml += `
                                    </div>
                                `;
                        document.getElementById('track-order-result').innerHTML = resultHtml;
                        document.getElementById('track-order-popup').style.display = 'flex';
                        document.getElementById('track-order-overlay').style.display = 'block';
                    } else {
                        alert('Không tìm thấy đơn hàng!');
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert('Có lỗi xảy ra!');
                });
        });

        document.querySelector('.track-order-close').addEventListener('click', function () {
            document.getElementById('track-order-popup').style.display = 'none';
            document.getElementById('track-order-overlay').style.display = 'none';
        });

    </script>
@endsection