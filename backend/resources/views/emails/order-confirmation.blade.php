<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1976d2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #e0e0e0;
        }
        .order-info {
            background-color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            border-left: 4px solid #4caf50;
        }
        .order-info h2 {
            color: #4caf50;
            margin-top: 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: bold;
            color: #666;
        }
        .info-value {
            color: #333;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: white;
        }
        .products-table th {
            background-color: #f5f5f5;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #e0e0e0;
        }
        .products-table td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
        }
        .product-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 5px;
        }
        .total-section {
            background-color: #e3f2fd;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        .total-row.final {
            font-size: 1.2em;
            font-weight: bold;
            color: #1976d2;
            border-top: 2px solid #1976d2;
            padding-top: 15px;
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 0.9em;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #1976d2;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Đặt hàng thành công!</h1>
    </div>
    
    <div class="content">
        <p>Xin chào <strong>{{ $order['name_customer'] }}</strong>,</p>
        
        <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.</p>
        
        <div class="order-info">
            <h2>Thông tin đơn hàng</h2>
            <div class="info-row">
                <span class="info-label">Mã đơn hàng:</span>
                <span class="info-value"><strong>{{ $order['order_code'] }}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Ngày đặt hàng:</span>
                <span class="info-value">{{ $order['date_order'] }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Phương thức thanh toán:</span>
                <span class="info-value">{{ $order['method_pay'] }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Số điện thoại:</span>
                <span class="info-value">{{ $order['phone_customer'] }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Địa chỉ giao hàng:</span>
                <span class="info-value">{{ $order['address_customer'] }}</span>
            </div>
        </div>
        
        <h3>Chi tiết sản phẩm:</h3>
        <table class="products-table">
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th>Size</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order['products'] as $product)
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            @if(!empty($product->image_url))
                            <img src="{{ $product->image_url }}" alt="{{ $product->name_product }}" class="product-image">
                            @endif
                            <span>{{ $product->name_product }}</span>
                        </div>
                    </td>
                    <td>{{ $product->size ?? '-' }}</td>
                    <td>{{ $product->quantity_detail }}</td>
                    <td>{{ number_format($product->total_detail, 0, ',', '.') }}₫</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
        <div class="total-section">
            <div class="total-row">
                <span>Tạm tính:</span>
                <span>{{ $order['subtotal_order'] }}</span>
            </div>
            @if($order['voucher_discount'] != '0₫')
            <div class="total-row">
                <span>Giảm giá (Voucher):</span>
                <span>-{{ $order['voucher_discount'] }}</span>
            </div>
            @endif
            <div class="total-row final">
                <span>Tổng cộng:</span>
                <span>{{ $order['total_order'] }}</span>
            </div>
        </div>
        
        <p><strong>Lưu ý:</strong> Nếu bạn chọn thanh toán khi nhận hàng, vui lòng chuẩn bị đúng số tiền khi nhận đơn hàng. Chúng tôi sẽ liên hệ với bạn qua số điện thoại đã cung cấp để xác nhận đơn hàng.</p>
        
        <div style="text-align: center;">
            <a href="{{ $order['app_url'] }}/orders/{{ $order['order_id'] }}" class="button">Xem chi tiết đơn hàng</a>
        </div>
    </div>
    
    <div class="footer">
        <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!</p>
        <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.</p>
    </div>
</body>
</html>
