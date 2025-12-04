<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development/)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).


├── app/                  # Chứa mã nguồn chính của ứng dụng
│   ├── Http/             # Controllers, Middleware, Request
│   ├── Models/           # Các model tương tác với CSDL
│   └── Providers/        # Service providers cho ứng dụng
├── bootstrap/            # Khởi động và load file autoload
├── config/               # Các file cấu hình cho ứng dụng
├── database/             # Migration, Seeder, và Factory
├── public/               # Thư mục public truy cập từ trình duyệt
├── resources/            # Giao diện người dùng: views, assets
├── routes/               # Các định tuyến web, API
├── storage/              # Logs, cache, và file upload
├── tests/                # Kiểm thử (unit, feature tests)
├── vendor/               # Các thư viện cài qua Composer
├── .env                  # Biến môi trường cấu hình ứng dụng
├── artisan               # CLI cho các lệnh Laravel
├── composer.json         # Định nghĩa các package PHP sử dụng
├── package.json          # Định nghĩa các package frontend
├── vite.config.js        # Cấu hình Vite cho build frontend
└── README.md             # Tài liệu mô tả dự án

# 👗 Fashion Store - Website Thời Trang


## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt dự án](#cài-đặt-dự-án)
- [Cấu hình Database](#cấu-hình-database)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Tài khoản test](#tài-khoản-test)
- [Cấu trúc Database](#cấu-trúc-database)
- [API Endpoints](#api-endpoints)
- [Xử lý lỗi](#xử-lý-lỗi)

---

## 🖥️ Yêu cầu hệ thống

- PHP >= 8.1
- Composer
- MySQL >= 5.7 hoặc MariaDB >= 10.2
- Node.js >= 16.x (nếu có frontend)
- Git

---

## 🚀 Cài đặt dự án

### Bước 1: Clone dự án

```bash
git clone <repository-url>
cd fashion-store
```

### Bước 2: Cài đặt dependencies

```bash
# Cài đặt PHP dependencies
composer install

# Cài đặt Node dependencies (nếu có)
npm install
```

### Bước 3: Cấu hình môi trường

```bash
# Tạo file .env từ .env.example
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Bước 4: Chỉnh sửa file .env

Mở file `.env` và cấu hình thông tin database:

```env
APP_NAME="Fashion Store"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=huyproject
DB_USERNAME=root
DB_PASSWORD=

# Nếu dùng XAMPP với port 3307
# DB_PORT=3307
```

---

## 🗄️ Cấu hình Database

### Cách 1: Import file SQL có sẵn (Khuyến nghị)

#### Sử dụng phpMyAdmin:
1. Truy cập http://localhost/phpmyadmin
2. Tạo database mới tên `huyproject`
3. Chọn database vừa tạo
4. Click tab "Import"
5. Chọn file `huyproject.sql`
6. Click "Go"

#### Sử dụng Command Line:
```bash
# Tạo database
mysql -u root -p -e "CREATE DATABASE huyproject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import dữ liệu
mysql -u root -p huyproject < huyproject.sql

# Nếu XAMPP dùng port 3307
mysql -u root -P 3307 huyproject < huyproject.sql
```

### Cách 2: Chạy Migration (nếu không có file SQL)

```bash
# Chạy migration để tạo bảng
php artisan migrate

# Seed dữ liệu mẫu (nếu có)
php artisan db:seed
```

---

## ▶️ Chạy ứng dụng

### Khởi động Laravel server

```bash
php artisan serve
```

Ứng dụng sẽ chạy tại: **http://localhost:8000**

### Build frontend (nếu có)

```bash
# Development mode
npm run dev

# Production build
npm run build
```

### Tạo symbolic link cho storage

```bash
php artisan storage:link
```

---

## 🔐 Tài khoản test

### ⚠️ QUAN TRỌNG: Mật khẩu mặc định

**Tất cả tài khoản đều có mật khẩu là: `password`**

### 👨‍💼 Tài khoản Admin

| Email | Password | Role |
|-------|----------|------|
| admin@fashionstore.com | `password` | Admin |

### 👥 Tài khoản Khách hàng

| STT | Email | Password | Tên |
|-----|-------|----------|-----|
| 1 | nguyenvanan@gmail.com | `password` | Nguyễn Văn An |
| 2 | tranthibinh@gmail.com | `password` | Trần Thị Bình |
| 3 | lehoangcuong@gmail.com | `password` | Lê Hoàng Cường |
| 4 | phamthidieu@gmail.com | `password` | Phạm Thị Diệu |
| 5 | hoangvanem@gmail.com | `password` | Hoàng Văn Em |
| 6 | vuthiphuong@gmail.com | `password` | Vũ Thị Phượng |
| 7 | dominggiang@gmail.com | `password` | Đỗ Minh Giang |
| 8 | buithihoa@gmail.com | `password` | Bùi Thị Hoa |
| 9 | ngovanich@gmail.com | `password` | Ngô Văn Ích |

---

## 📊 Cấu trúc Database

### Các bảng chính

| Bảng | Mô tả | Số lượng record test |
|------|-------|---------------------|
| `users` | Quản lý người dùng | 10 (1 admin + 9 user) |
| `categories_product` | Danh mục sản phẩm | 10 danh mục |
| `products` | Sản phẩm thời trang | 20 sản phẩm |
| `carts` | Giỏ hàng | 12 items |
| `orders` | Đơn hàng | 10 đơn hàng |
| `order_details` | Chi tiết đơn hàng | 22 items |

### Mối quan hệ

```
users (1) ----< (n) carts
users (1) ----< (n) orders

categories_product (1) ----< (n) products

products (1) ----< (n) carts
products (1) ----< (n) order_details

orders (1) ----< (n) order_details
```

---

## 🛍️ Dữ liệu mẫu

### Danh mục sản phẩm (10 categories)
- Áo Nam
- Áo Nữ
- Quần Nam
- Quần Nữ
- Váy Đầm
- Áo Khoác
- Đồ Thể Thao
- Đồ Ngủ
- Phụ Kiện
- Giày Dép

### Sản phẩm (20 products)
Các sản phẩm thời trang với giá từ **150,000₫ - 950,000₫**, bao gồm:
- Áo sơ mi, áo thun, áo polo
- Quần jeans, quần kaki, quần âu
- Váy đầm, váy maxi
- Áo khoác jeans, áo khoác dạ
- Đồ thể thao, đồ yoga

### Trạng thái đơn hàng

#### Trạng thái giao hàng (status_delivery):
- `0`: Đang chuẩn bị
- `1`: Đang giao hàng
- `2`: Đã giao hàng

#### Trạng thái đơn hàng (status_order):
- `0`: Chờ xử lý
- `1`: Đang xử lý
- `2`: Hoàn thành

#### Phương thức thanh toán (method_pay):
- `0`: Thanh toán khi nhận hàng (COD)
- `1`: Chuyển khoản ngân hàng

---

## 🔧 API Endpoints (Ví dụ)

### Authentication
```
POST   /api/login          # Đăng nhập
POST   /api/register       # Đăng ký
POST   /api/logout         # Đăng xuất
```

### Products
```
GET    /api/products       # Danh sách sản phẩm
GET    /api/products/{id}  # Chi tiết sản phẩm
POST   /api/products       # Tạo sản phẩm (Admin)
PUT    /api/products/{id}  # Cập nhật sản phẩm (Admin)
DELETE /api/products/{id}  # Xóa sản phẩm (Admin)
```

### Categories
```
GET    /api/categories     # Danh sách danh mục
GET    /api/categories/{id}/products  # Sản phẩm theo danh mục
```

### Cart
```
GET    /api/cart           # Xem giỏ hàng
POST   /api/cart           # Thêm vào giỏ
PUT    /api/cart/{id}      # Cập nhật số lượng
DELETE /api/cart/{id}      # Xóa khỏi giỏ
```

### Orders
```
GET    /api/orders         # Danh sách đơn hàng
GET    /api/orders/{id}    # Chi tiết đơn hàng
POST   /api/orders         # Tạo đơn hàng
PUT    /api/orders/{id}    # Cập nhật trạng thái (Admin)
```

*Xem danh sách đầy đủ:*
```bash
php artisan route:list
```

---

## 🛠️ Các lệnh hữu ích

### Cache
```bash
# Clear all cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize (production)
php artisan optimize
```

### Database
```bash
# Xem trạng thái migration
php artisan migrate:status

# Rollback migration
php artisan migrate:rollback

# Reset và chạy lại migration
php artisan migrate:fresh

# Reset và seed lại data
php artisan migrate:fresh --seed
```

### Testing
```bash
# Chạy tests
php artisan test

# Chạy test với coverage
php artisan test --coverage
```

---

## ❌ Xử lý lỗi thường gặp

### Lỗi: "SQLSTATE[HY000] [1045] Access denied"
**Giải pháp:** Kiểm tra lại thông tin database trong file `.env`

### Lỗi: "No application encryption key"
**Giải pháp:** 
```bash
php artisan key:generate
```

### Lỗi: "Class not found"
**Giải pháp:**
```bash
composer dump-autoload
```

### Lỗi: Permission denied trên storage
**Giải pháp:**
```bash
# Windows (Run as Administrator)
icacls storage /grant Everyone:(OI)(CI)F /T
icacls bootstrap/cache /grant Everyone:(OI)(CI)F /T

# Linux/Mac
chmod -R 775 storage
chmod -R 775 bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
```

### Lỗi: "Connection refused" khi kết nối database
**Giải pháp:**
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra port trong `.env` (thường là 3306 hoặc 3307 với XAMPP)
- Test kết nối: `mysql -u root -p`

---

## 📝 Notes

### Đổi mật khẩu cho user

Sử dụng Laravel Tinker:
```bash
php artisan tinker
```

Sau đó:
```php
$user = App\Models\User::find(1);
$user->password = bcrypt('new_password');
$user->save();
```

### Tạo hash mật khẩu mới
```php
php artisan tinker
echo bcrypt('your_password');
```

### Reset tất cả dữ liệu
```bash
php artisan migrate:fresh
# Sau đó import lại file huyproject.sql
```

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra log tại:
- `storage/logs/laravel.log`
- PHP error log
- MySQL error log

Hoặc chạy:
```bash
php artisan about
```

---


