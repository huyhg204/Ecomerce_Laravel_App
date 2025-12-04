@extends('user.layout')

@section('title', 'Quản lý đơn hàng')
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
        <h2 class="mb-4">Danh sách đơn hàng của tôi</h2>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Mã đơn hàng</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái đơn</th>
                    <th>Trạng thái giao hàng</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                @foreach($orders as $order)
                    <tr>
                        <td>{{ $order->id }}</td>
                        <td>{{ $order->date_order }}</td>
                        <td>{{ number_format($order->total_order) }} đ</td>
                        <td>
                            @if($order->status_order == 0)
                                Đang chờ xử lý
                            @elseif($order->status_order == 1)
                                Đang xử lý
                            @else
                                Đã hoàn thành
                            @endif
                        </td>
                        <td>
                            @if($order->status_delivery == 0)
                                Đang chuẩn bị
                            @elseif($order->status_delivery == 1)
                                Đang giao
                            @else
                                Đã giao
                            @endif
                        </td>
                        <td>
                            <button type="button" class="btn btn-sm btn-info track-order-btn" data-order-id="{{ $order->id }}">Xem chi tiết</button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Popup chi tiết đơn hàng -->
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
        document.querySelectorAll('.track-order-btn').forEach(function(button) {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-order-id');

                fetch(`/api/user/orders/${orderId}`,{
                    method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            let resultHtml = '';
                            resultHtml += `
                                <p><strong>Mã đơn hàng:</strong> ${data.data.order_code}</p>
                                <p><strong>Ngày đặt:</strong> ${data.data.date_order}</p>
                                <p><strong>Tổng tiền:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.data.total_order)}</p>
                                <p><strong>Trạng thái đơn hàng:</strong> ${getOrderStatus(data.data.status_order)}</p>
                                <p><strong>Trạng thái giao hàng:</strong> ${getDeliveryStatus(data.data.status_delivery)}</p>
                                <hr>
                            `;

                            data.data.products.forEach(item => {
                                resultHtml += `
                                    <img src="${item.image_product}" alt="${item.name_product}" style="width: 100px;">
                                    <p><strong>Sản phẩm:</strong> ${item.name_product}</p>
                                    <p><strong>Số lượng:</strong> ${item.quantity_detail}</p>
                                    <p><strong>Tổng tiền món:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_detail)}</p>
                                    <hr>
                                `;
                            });

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
        });

        document.querySelector('.track-order-close').addEventListener('click', function () {
            document.getElementById('track-order-popup').style.display = 'none';
            document.getElementById('track-order-overlay').style.display = 'none';
        });

        function getOrderStatus(status) {
            switch (status) {
                case 0: return 'Đang chờ xử lý';
                case 1: return 'Đang xử lý';
                case 2: return 'Đã hoàn thành';
                default: return 'Không xác định';
            }
        }

        function getDeliveryStatus(status) {
            switch (status) {
                case 0: return 'Đang chuẩn bị';
                case 1: return 'Đang giao';
                case 2: return 'Đã giao';
                default: return 'Không xác định';
            }
        }
    </script>
@endsection
