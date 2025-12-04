# 🚀 HƯỚNG DẪN CHẠY DỰ ÁN FASHION STORE

## Yêu cầu
- PHP >= 8.2
- Composer
- MySQL
- Node.js (nếu có frontend)

---

## Các bước chạy

### Bước 1: Cài đặt dependencies
```bash
composer install
npm install
```

### Bước 2: Tạo file .env và cấu hình
```bash
# Tạo file .env (nếu chưa có, tạo file mới)
# Sau đó tạo key cho ứng dụng
php artisan key:generate
```

### Bước 3: Cấu hình database trong file `.env`
Mở file `.env` và sửa thông tin database:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=huyproject
DB_USERNAME=root
DB_PASSWORD=
```

### Bước 4: Tạo database và import dữ liệu

**Cách 1: Import file SQL (Khuyến nghị)**
1. Tạo database trong phpMyAdmin hoặc MySQL
2. Import file `db_fashion_store.sql` vào database

**Cách 2: Chạy migration**
```bash
php artisan migrate
```

### Bước 5: Tạo link storage (nếu cần)
```bash
php artisan storage:link
```

### Bước 6: Chạy ứng dụng
```bash
php artisan serve
```

Truy cập: **http://localhost:8000**

---

## 🔐 Tài khoản đăng nhập

**Admin:**
- Email: `admin@fashionstore.com`
- Password: `password`

**User:**
- Email: `nguyenvanan@gmail.com`
- Password: `password`

---

## ⚠️ Lưu ý

- **Không cần chạy migrate mỗi lần** - Migration chỉ chạy một lần khi setup
- Nếu đã import SQL thì không cần chạy `php artisan migrate`
- Kiểm tra MySQL đã chạy trước khi start ứng dụng

---

## ❌ Xử lý lỗi thường gặp

**Lỗi kết nối database:**
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra thông tin trong file `.env`

**Lỗi "No application encryption key":**
```bash
php artisan key:generate
```

**Lỗi "Class not found":**
```bash
composer dump-autoload
```

