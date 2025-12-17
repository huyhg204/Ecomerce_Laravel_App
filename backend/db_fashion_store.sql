-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 17, 2025 lúc 03:07 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `db_fashion_store`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT 'Tiêu đề banner',
  `description` text DEFAULT NULL COMMENT 'Mô tả banner',
  `image` varchar(500) DEFAULT NULL COMMENT 'Đường dẫn ảnh banner',
  `link` varchar(500) DEFAULT NULL COMMENT 'Link khi click vào banner',
  `badge` varchar(100) DEFAULT NULL COMMENT 'Badge hiển thị trên banner',
  `position` int(11) NOT NULL DEFAULT 0 COMMENT 'Vị trí banner (0: hero slider, 1: banner single)',
  `order` int(11) NOT NULL DEFAULT 0 COMMENT 'Thứ tự hiển thị',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0: Ẩn, 1: Hiển thị',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `banners`
--

INSERT INTO `banners` (`id`, `title`, `description`, `image`, `link`, `badge`, `position`, `order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Bộ Sưu Tập Thu Đông 2024', 'Khám phá những xu hướng thời trang mới nhất với bộ sưu tập thu đông độc quyền. Áo khoác, váy đầm và phụ kiện cao cấp.', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80', '/products', 'Bộ Sưu Tập Mới', 0, 1, 1, '2025-12-04 02:22:40', '2025-12-04 02:22:40'),
(2, 'Giảm Giá Lên Đến 50%', 'Sale lớn cuối năm! Hàng ngàn sản phẩm được giảm giá đặc biệt. Nhanh tay mua sắm để không bỏ lỡ cơ hội.', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80', '/products', 'Khuyến Mãi', 0, 2, 1, '2025-12-04 02:22:40', '2025-12-04 02:22:40'),
(3, 'Thời Trang Công Sở Thanh Lịch', 'Tỏa sáng tại nơi làm việc với bộ sưu tập áo sơ mi, quần tây và váy công sở sang trọng, chuyên nghiệp.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80', '/products', 'Thời Trang Công Sở', 0, 3, 1, '2025-12-04 02:22:40', '2025-12-04 02:22:40'),
(4, 'Nâng Tầm Phong Cách Của Bạn', 'Khám phá bộ sưu tập thời trang đa dạng với hơn 16.000 sản phẩm cao cấp, từ áo quần đến phụ kiện, phù hợp mọi dịp và phong cách.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80', '/products', 'Danh Mục', 1, 1, 1, '2025-12-04 02:22:41', '2025-12-04 02:22:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `product_attribute_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'ID thuộc tính sản phẩm (size/color)',
  `size` varchar(50) DEFAULT NULL COMMENT 'Size đã chọn',
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `quantity_item` int(11) NOT NULL,
  `total_item` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `carts`
--

INSERT INTO `carts` (`id`, `product_id`, `product_attribute_id`, `size`, `user_id`, `quantity_item`, `total_item`) VALUES
(3, 4, NULL, NULL, 3, 1, 280000),
(4, 10, NULL, NULL, 3, 2, 960000),
(5, 13, NULL, NULL, 4, 1, 520000),
(6, 16, NULL, NULL, 5, 1, 650000),
(7, 2, NULL, NULL, 6, 3, 450000),
(8, 8, NULL, NULL, 6, 1, 380000),
(9, 14, NULL, NULL, 7, 1, 480000),
(10, 19, NULL, NULL, 8, 1, 550000),
(11, 5, NULL, NULL, 9, 2, 640000),
(12, 11, NULL, NULL, 9, 1, 350000),
(16, 1, NULL, NULL, 1, 1, 350000),
(22, 19, NULL, NULL, 11, 3, 1650000),
(45, 50, 241, 'S', 2, 1, 480000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories_product`
--

CREATE TABLE `categories_product` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_category` varchar(255) NOT NULL,
  `image_category` varchar(255) NOT NULL,
  `status_category` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 is enable,1 is disable'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories_product`
--

INSERT INTO `categories_product` (`id`, `name_category`, `image_category`, `status_category`) VALUES
(1, 'Áo Nam', 'categories/ao-nam.jpg', 0),
(2, 'Áo Nữ', 'categories/ao-nu.jpg', 0),
(3, 'Quần Nam', 'categories/quan-nam.jpg', 0),
(4, 'Quần Nữ', 'categories/quan-nu.jpg', 0),
(5, 'Váy Đầm', 'categories/vay-dam.jpg', 0),
(6, 'Áo Khoác', 'categories/ao-khoac.jpg', 0),
(7, 'Đồ Thể Thao', 'categories/do-the-thao.jpg', 0),
(8, 'Đồ Ngủ', 'categories/do-ngu.jpg', 0),
(9, 'Phụ Kiện', 'categories/phu-kien.jpg', 0),
(10, 'Giày Dép', 'categories/giay-dep.jpg', 0),
(11, 'ádasdasdasdad', 'uploads/categories/1763993321_image.png', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date_order` timestamp NOT NULL DEFAULT current_timestamp(),
  `method_pay` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 is POD, 1 is Banking',
  `status_order` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 is pending,1 is are proccess,2 is done',
  `total_order` float NOT NULL,
  `voucher_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'ID voucher đã áp dụng',
  `voucher_code` varchar(50) DEFAULT NULL COMMENT 'Mã voucher',
  `voucher_discount` decimal(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Số tiền giảm từ voucher',
  `subtotal_order` decimal(15,2) DEFAULT NULL COMMENT 'Tổng tiền trước khi giảm',
  `phone_customer` varchar(255) NOT NULL,
  `address_customer` varchar(255) NOT NULL,
  `name_customer` varchar(255) NOT NULL,
  `note_customer` varchar(255) DEFAULT NULL,
  `reason_user_order` varchar(255) DEFAULT NULL,
  `status_user_order` int(11) DEFAULT NULL,
  `status_delivery` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `date_order`, `method_pay`, `status_order`, `total_order`, `voucher_id`, `voucher_code`, `voucher_discount`, `subtotal_order`, `phone_customer`, `address_customer`, `name_customer`, `note_customer`, `reason_user_order`, `status_user_order`, `status_delivery`) VALUES
(1, 2, '2024-03-15 03:30:00', 0, 2, 1100000, NULL, NULL, 0.00, NULL, '0912345678', '456 Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn An', 'Giao giờ hành chính', NULL, NULL, NULL),
(2, 3, '2024-03-16 07:20:00', 1, 2, 780000, NULL, NULL, 0.00, NULL, '0923456789', '789 Võ Văn Tần, Quận 3, TP.HCM', 'Trần Thị Bình', NULL, NULL, NULL, 2),
(3, 4, '2024-03-17 02:15:00', 0, 1, 1450000, NULL, NULL, 0.00, NULL, '0934567890', '321 Hai Bà Trưng, Quận 3, TP.HCM', 'Lê Hoàng Cường', 'Gọi trước khi giao', NULL, NULL, NULL),
(4, 5, '2024-03-18 04:45:00', 1, 1, 650000, NULL, NULL, 0.00, NULL, '0945678901', '654 Trần Hưng Đạo, Quận 5, TP.HCM', 'Phạm Thị Diệu', NULL, NULL, NULL, NULL),
(5, 6, '2024-03-19 08:30:00', 0, 0, 830000, NULL, NULL, 0.00, NULL, '0956789012', '987 Phan Xích Long, Phú Nhuận, TP.HCM', 'Hoàng Văn Em', 'Để ở bảo vệ nếu không có người', NULL, NULL, NULL),
(6, 7, '2024-03-20 01:00:00', 1, 0, 950000, NULL, NULL, 0.00, NULL, '0967890123', '147 Điện Biên Phủ, Bình Thạnh, TP.HCM', 'Vũ Thị Phượng', NULL, NULL, NULL, NULL),
(7, 8, '2024-03-21 06:20:00', 0, 2, 550000, NULL, NULL, 0.00, NULL, '0978901234', '258 Cách Mạng Tháng 8, Quận 10, TP.HCM', 'Đỗ Minh Giang', NULL, NULL, NULL, NULL),
(8, 9, '2024-03-22 03:00:00', 1, 2, 990000, NULL, NULL, 0.00, NULL, '0989012345', '369 Nguyễn Thị Minh Khai, Quận 1, TP.HCM', 'Bùi Thị Hoa', 'Giao vào buổi chiều', NULL, NULL, 2),
(9, 10, '2024-03-23 09:45:00', 0, 0, 1300000, NULL, NULL, 0.00, NULL, '0990123456', '741 Lý Thường Kiệt, Quận 11, TP.HCM', 'Ngô Văn Ích', NULL, NULL, NULL, NULL),
(10, 2, '2024-03-24 05:30:00', 1, 2, 870000, NULL, NULL, 0.00, NULL, '0912345678', '456 Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn An', 'Giao hàng cẩn thận', NULL, 0, 2),
(14, 2, '2025-12-04 00:34:45', 0, 0, 1870000, NULL, NULL, 0.00, NULL, '0912345678', '456 Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn An', NULL, NULL, NULL, NULL),
(15, 2, '2025-12-04 00:44:27', 0, 0, 480000, NULL, NULL, 0.00, NULL, '0912345678', '456 Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn An', NULL, NULL, NULL, NULL),
(17, 2, '2025-12-08 15:16:48', 0, 0, 960000, NULL, NULL, 0.00, 960000.00, '0936481801', '682 Đường BCD, Quận 12, TP.HCM', 'Trần Thị Bình', NULL, NULL, NULL, NULL),
(18, 2, '2025-12-08 15:17:40', 2, 0, 480000, NULL, NULL, 0.00, 480000.00, '0936481801', '682 Đường BCD, Quận 12, TP.HCM', 'Trần Thị Bình', NULL, NULL, NULL, NULL),
(19, 2, '2025-12-08 15:20:33', 2, 0, 480000, NULL, NULL, 0.00, 480000.00, '0936481801', '682 Đường BCD, Quận 12, TP.HCM', 'Trần Thị Bình', NULL, NULL, NULL, NULL),
(20, 2, '2025-12-08 15:24:16', 2, 0, 480000, NULL, NULL, 0.00, 480000.00, '0936481801', '682 Đường BCD, Quận 12, TP.HCM', 'Trần Thị Bình', NULL, NULL, NULL, NULL),
(23, 2, '2025-12-08 15:31:10', 2, 0, 480000, NULL, NULL, 0.00, 480000.00, '0936481801', '682 Đường BCD, Quận 12, TP.HCM', 'Trần Thị Bình', NULL, NULL, NULL, NULL),
(24, 2, '2025-12-08 15:35:05', 2, 0, 480000, NULL, NULL, 0.00, 480000.00, '0936481801', '682 Đường BCD, Quận 12, TP.HCM', 'Trần Thị Bình', NULL, NULL, NULL, NULL),
(25, 2, '2025-12-08 15:39:42', 2, 0, 480000, NULL, NULL, 0.00, 480000.00, '0936481801', '682 Đường BCD, Quận 12, TP.HCM', 'Trần Thị Bình', NULL, NULL, NULL, NULL),
(26, 2, '2025-12-08 15:42:59', 2, 2, 480000, NULL, NULL, 0.00, 480000.00, '0936481801', '682 Đường BCD, Quận 12, TP.HCM', 'Trần Thị Bình', NULL, NULL, NULL, 2),
(27, 2, '2025-12-08 17:08:33', 2, 2, 960480, NULL, NULL, 0.00, 960480.00, '0912345678', '456 Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn An', NULL, NULL, 0, 2),
(28, 2, '2025-12-08 17:08:55', 2, 2, 910480, 2, 'GIAM50K', 50000.00, 960480.00, '0912345678', '456 Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn An', NULL, NULL, 0, 2),
(29, 2, '2025-12-08 17:10:13', 2, 2, 910480, 2, 'GIAM50K', 50000.00, 960480.00, '0912345678', '456 Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn An', NULL, NULL, 0, 2),
(30, 2, '2025-12-10 11:37:00', 1, 2, 480000, NULL, NULL, 0.00, 480000.00, '0912345678', '456 Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn An', NULL, NULL, 0, 2),
(31, 2, '2025-12-10 11:38:42', 2, 2, 480000, NULL, NULL, 0.00, 480000.00, '0912345678', '456 Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn An', NULL, NULL, 0, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_details`
--

CREATE TABLE `order_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `product_attribute_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'ID thuộc tính sản phẩm (size/color)',
  `size` varchar(50) DEFAULT NULL COMMENT 'Size đã chọn',
  `quantity_detail` int(11) NOT NULL,
  `total_detail` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `product_attribute_id`, `size`, `quantity_detail`, `total_detail`) VALUES
(1, 1, 1, NULL, NULL, 2, 700000),
(2, 1, 3, NULL, NULL, 1, 250000),
(3, 1, 2, NULL, NULL, 1, 150000),
(4, 2, 4, NULL, NULL, 1, 280000),
(5, 2, 12, NULL, NULL, 2, 440000),
(6, 2, 6, NULL, NULL, 1, 180000),
(7, 3, 7, NULL, NULL, 2, 900000),
(8, 3, 8, NULL, NULL, 1, 380000),
(9, 3, 18, NULL, NULL, 1, 450000),
(10, 4, 16, NULL, NULL, 1, 650000),
(11, 5, 2, NULL, NULL, 3, 450000),
(12, 5, 8, NULL, NULL, 1, 380000),
(13, 6, 14, NULL, NULL, 1, 480000),
(14, 6, 17, NULL, NULL, 1, 950000),
(15, 7, 19, NULL, NULL, 1, 550000),
(16, 8, 5, NULL, NULL, 2, 640000),
(17, 8, 11, NULL, NULL, 1, 350000),
(18, 9, 13, NULL, NULL, 2, 1040000),
(19, 9, 15, NULL, NULL, 1, 350000),
(20, 10, 9, NULL, NULL, 1, 420000),
(21, 10, 3, NULL, NULL, 1, 250000),
(22, 10, 6, NULL, NULL, 1, 180000),
(30, 14, 51, NULL, NULL, 2, 960000),
(31, 14, 51, NULL, 'M', 2, 960000),
(32, 15, 51, NULL, 'L', 1, 480000),
(34, 17, 51, NULL, 'L', 1, 480000),
(35, 17, 50, 243, 'L', 1, 480000),
(36, 18, 50, 243, 'L', 1, 480000),
(37, 19, 50, 243, 'L', 1, 480000),
(38, 20, 50, 243, 'L', 1, 480000),
(41, 23, 50, 243, 'L', 1, 480000),
(42, 24, 50, 243, 'L', 1, 480000),
(43, 25, 50, 243, 'L', 1, 480000),
(44, 26, 50, 243, 'L', 1, 480000),
(45, 27, 50, 243, 'L', 1, 480000),
(46, 27, 48, 283, 'L', 1, 480480),
(47, 28, 50, 243, 'L', 1, 480000),
(48, 28, 48, 283, 'L', 1, 480480),
(49, 29, 50, 243, 'L', 1, 480000),
(50, 29, 48, 283, 'L', 1, 480480),
(51, 30, 50, 243, 'L', 1, 480000),
(52, 31, 50, 242, 'M', 1, 480000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_otps`
--

CREATE TABLE `password_reset_otps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_token_expires_at` timestamp NULL DEFAULT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_product` varchar(255) NOT NULL,
  `description_product` varchar(255) NOT NULL,
  `image_product` varchar(255) NOT NULL,
  `original_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá gốc',
  `discount_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá sau giảm',
  `discount_percent` int(11) DEFAULT 0 COMMENT 'Phần trăm giảm giá',
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `status_product` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 is enable,1 is disable'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name_product`, `description_product`, `image_product`, `original_price`, `discount_price`, `discount_percent`, `category_id`, `status_product`) VALUES
(1, 'Áo Sơ Mi Nam Trắng Oxford', 'Áo sơ mi nam chất liệu cotton cao cấp, thiết kế cổ điển, phù hợp đi làm và dự tiệc', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 455000.00, 350000.00, 23, 1, 0),
(2, 'Áo Thun Nam Basic Đen', 'Áo thun nam chất liệu cotton 100%, form regular fit thoải mái', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 195000.00, 150000.00, 23, 1, 0),
(3, 'Áo Polo Nam Xanh Navy', 'Áo polo nam chất liệu pique cotton, thấm hút mồ hôi tốt', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 325000.00, 250000.00, 23, 1, 0),
(4, 'Áo Kiểu Nữ Hoa Nhí', 'Áo kiểu nữ họa tiết hoa nhí dịu dàng, chất liệu voan mềm mại', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 364000.00, 280000.00, 23, 2, 0),
(5, 'Áo Sơ Mi Nữ Trắng Công Sở', 'Áo sơ mi nữ thiết kế thanh lịch, phù hợp môi trường văn phòng', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 416000.00, 320000.00, 23, 2, 0),
(6, 'Áo Croptop Nữ Trắng', 'Áo croptop nữ phong cách trẻ trung, năng động', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 234000.00, 180000.00, 23, 2, 0),
(7, 'Quần Jeans Nam Xanh Đậm', 'Quần jeans nam dáng slim fit, chất liệu denim co giãn nhẹ', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 585000.00, 450000.00, 23, 3, 0),
(8, 'Quần Kaki Nam Be', 'Quần kaki nam form regular, chất liệu thoáng mát', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 494000.00, 380000.00, 23, 3, 0),
(9, 'Quần Âu Nam Đen', 'Quần âu nam công sở, form chuẩn, vải không nhăn', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 546000.00, 420000.00, 23, 3, 0),
(10, 'Quần Jeans Nữ Rách Gối', 'Quần jeans nữ phong cách cá tính, rách nhẹ ở gối', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 624000.00, 480000.00, 23, 4, 0),
(11, 'Quần Tây Nữ Đen', 'Quần tây nữ công sở, thiết kế ống suông thanh lịch', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 455000.00, 350000.00, 23, 4, 0),
(12, 'Quần Short Nữ Vải', 'Quần short nữ dáng suông thoải mái, phù hợp mùa hè', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 286000.00, 220000.00, 23, 4, 0),
(13, 'Váy Maxi Hoa Dài', 'Váy maxi hoa dạo phố, thiết kế xòe nhẹ nhàng', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 676000.00, 520000.00, 23, 5, 0),
(14, 'Đầm Công Sở Đen', 'Đầm công sở thiết kế đơn giản, thanh lịch', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 624000.00, 480000.00, 23, 5, 0),
(15, 'Váy Chữ A Trắng', 'Váy chữ A dáng xòe trẻ trung, phù hợp dạo phố', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 455000.00, 350000.00, 23, 5, 0),
(16, 'Áo Khoác Jeans Nam', 'Áo khoác jeans nam phong cách năng động', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 845000.00, 650000.00, 23, 6, 0),
(17, 'Áo Khoác Dạ Nữ', 'Áo khoác dạ nữ ấm áp, thiết kế sang trọng', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 1235000.00, 950000.00, 23, 6, 0),
(18, 'Áo Gió Nam', 'Áo gió nam chống nước, phù hợp hoạt động ngoài trời', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 585000.00, 450000.00, 23, 6, 0),
(19, 'Bộ Đồ Thể Thao Nam', 'Bộ đồ thể thao nam chất liệu thấm hút mồ hôi', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 715000.00, 550000.00, 23, 7, 0),
(20, 'Bộ Đồ Yoga Nữ', 'Bộ đồ yoga nữ co giãn 4 chiều, ôm dáng', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', NULL, NULL, 0, 7, 1),
(21, 'GZ Shadow Cap', 'Mũ len phong cách destroyed cá tính với các đường tua thô cố ý, tạo cảm giác bụi và phá cách. Chất len dày form ôm đầu, giữ ấm tốt nhưng vẫn thoáng khí. Logo GZ dệt nổi phía trước tạo điểm nhấn mạnh mẽ. Phù hợp streetwear, mix đồ layer, áo hoodie, jacket.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971248/GZ_Oblivion_Knit_Cap_chllx9.png', 585000.00, 450000.00, 23, 9, 0),
(22, 'GZ Street Torn', 'Mũ lưỡi trai đen với điểm rách nhẹ tinh tế, logo GZ thêu 3D nổi bật. Form cứng cáp, dễ phối mọi outfit từ casual tới streetstyle. Đai khóa sau điều chỉnh linh hoạt, đội ôm đầu, không bí.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971244/GZ_Oblivion_Echo_Cap_c21ybf.png', 624000.00, 480000.00, 23, 9, 0),
(23, 'GZ Blackout Edition', 'Thiết kế tối giản, mạnh mẽ với các chi tiết scratch rải nhẹ. Logo GZ dạng kim loại mảnh tạo phong cách “đô thị tối giản” hiện đại. Phù hợp nam nữ, thích hợp đi chơi – đi phố – chụp hình.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971243/GZ_Shadow_Brim_Cap_a4bc3x.png', 624000.00, 480000.00, 23, 9, 0),
(24, 'GZ Urban Destroyed', 'Điểm nhấn là logo GZ kim loại dạng mảng lớn, đi cùng đường chỉ “bung chỉ giả\" mang vibe street phá cách. Chất liệu mềm – uốn form đẹp – rách nghệ thuật tạo cá tính riêng.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971243/GZ_Oblivion_Stitch_Cap_aexrzv.png', 624000.00, 480000.00, 23, 9, 0),
(25, 'GZ Tactical Titan Pack', 'Balo tactical dung tích lớn, thiết kế đa ngăn kiểu quân đội. Chất liệu vải dày chống sờn, dây đai chắc – khóa kim loại bền. Vibe cực mạnh cho người thích du lịch, phượt, công việc outdoor. Logo GZ gắn trước nổi bật.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971248/GZ_System_Overload_Utility_Pack_j0lxh7.png', 624000.00, 480000.00, 23, 9, 0),
(26, 'GZ Rebel Cap', 'Mũ tone đen với phần rách sâu và logo GZ kim loại tone xám khói. Tạo phong cách underground mạnh, hợp với áo phông tối màu, áo khoác denim hoặc bomber.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971242/GZ_Ruin_Decon_Cap_vaeui2.png', 754000.00, 580000.00, 23, 9, 0),
(27, 'GZ Streetcore', 'Mũ phong cách tactical nhẹ, các chi tiết rách nhẹ và cắt lớp mang vibe lính – đường phố. Logo GZ mini tinh tế. Form cứng chắc, phù hợp hoạt động ngoài trời, du lịch, chụp hình phong cách “darkwear”.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971240/GZ_Oblivion_Distressed_Ball_Cap_cd5itv.png', 845000.00, 650000.00, 23, 9, 0),
(28, 'GZ Nightstorm', 'Form mũ tactical đen với nhiều chi tiết cắt chỉ và điểm rách đối xứng. Lưỡi trai cong vừa phải, đội thoải mái cả ngày. Giữ được vibe phủi bụi, nam tính, mạnh mẽ.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/GZ_Oblivion_Distressed_Cap_vsqt3u.png', 624000.00, 480000.00, 23, 9, 0),
(29, 'GZ Desert Ranger Pack', 'Balo phong cách lính desert, tone nâu vintage cực ngầu. Chất liệu canvas dày, nhiều ngăn phụ, dây kéo chắc chắn. Thích hợp trekking, đi phố, chụp hình phong cách thợ săn – retro – outdoor.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971247/GZ_System_Tech_Pack_p36rs3.png', 624000.00, 480000.00, 23, 9, 0),
(30, 'GZ Black Ops Pack', 'Tone đen full, khí chất mạnh mẽ như đồ lính đặc nhiệm. Form vuông – dây đai – khóa kim loại tạo độ “đầm”. Khoang chứa rộng, chịu tải tốt, bền bỉ cho cả công việc lẫn du lịch.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971246/GZ_Payload_Hauler_Pack_osodpf.png', 624000.00, 480000.00, 23, 9, 0),
(31, 'GZ Recon X-Series', 'Balo 3 tầng với hệ dây chéo X đặc trưng. Tạo điểm nhấn mạnh – khác biệt – đậm chất tactical. Màu rêu quân đội, ngăn trong rộng, chịu ma sát tốt. Phù hợp dân đi tour, đi rừng, phượt thủ.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971246/GZ_Ruin_Haul_Pack_tpcilb.png', 624000.00, 480000.00, 23, 9, 0),
(32, 'GZ Wilderness Cargo', 'Phiên bản nâu vintage với nhiều ngăn hộp kiểu cargo. Cảm giác “thám hiểm – dã ngoại”. Vải canvas dày, dây đai lớn, khóa bền. Thiết kế phù hợp du lịch, studio, outdoor.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971245/GZ_Ravage_Cargo_Pack_vch4ei.png', 624000.00, 480000.00, 23, 9, 0),
(33, 'GZ Urban Mini Sling (Yellow)', 'Túi đeo chéo mini màu vàng trẻ trung, hiện đại. Form vuông bo cạnh mềm mại, logo GZ đúc nổi ấn tượng. Nhỏ gọn nhưng đủ chứa đồ cá nhân. Hợp phối outfit streetwear – casual – daily.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/download_11_zzicvw.png', 624000.00, 480000.00, 23, 9, 0),
(34, 'GZ Compact Sidebag (Coral)', 'Túi màu cam đất độc lạ, thiết kế tối giản – điểm nhấn logo GZ kim loại trước. Dây đeo mềm, điều chỉnh dễ. Phù hợp đi chơi, dạo phố, café.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971231/download_12_rw5lgx.png', 624000.00, 480000.00, 23, 9, 0),
(35, 'GZ Field Utility Sling (Black)', 'Túi chéo tactical đen với form hộp vuông, nhiều ngăn nhỏ. Thân túi chống sờn, dây đai chắc chắn, phù hợp người thích phong cách lính – outdoor – utilitarian.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971230/download_3_wnqc6o.png', 624000.00, 480000.00, 23, 9, 0),
(36, 'GZ Core Hoodie (Black)', 'Hoodie đen form rộng, logo GZ trắng trước ngực. Chất nỉ dày mềm, ấm và thoải mái. Mặc đi học – đi làm – đi chơi đều hợp, mix được mọi phong cách.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_2_njpyho.png', 455000.00, 350000.00, 23, 6, 0),
(37, 'GZ Round Flare Skirt', 'Váy xoè rộng bo tròn, chuyển động đẹp khi đi lại. Mang vibe nữ tính – hiện đại. Phối được casual lẫn cá tính.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_10_xoyasx.png', 624000.00, 480000.00, 23, 5, 0),
(38, 'GZ Flow Motion Skirt (Black)', 'Váy xoè mỏng nhẹ hơn, độ xoè mềm tạo kiểu “bay gió” rất đẹp khi chụp ảnh. Dễ mix cùng áo đen – xám – croptop.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_7_ujsgbj.png', 624000.00, 480000.00, 23, 5, 0),
(39, 'GZ Desert Canvas Mini Skirt', 'Váy canvas màu nâu military, có dây rút – chi tiết rách nhẹ kiểu tactical. Mang phong cách độc lạ, phù hợp nữ cá tính yêu streetwear.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/dsc03116_large_5a43f0478dc74eb49b48b090be289ae6_wmyhcc.jpg', 624000.00, 480000.00, 23, 5, 0),
(40, 'GZ Indigo Wide-Leg Denim Skirt-Pants', 'Thiết kế dạng quần ống rộng nhưng mô phỏng chân váy, màu denim indigo đậm. Form rộng cực thoải mái, phong cách Nhật – streetwear – unisex.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/150925.hades3151_large_489341173b344d3db9cd03fb3968685a_f5d1s8.jpg', 624000.00, 480000.00, 23, 3, 0),
(41, 'GZ Nebula Runner – Purple/Orange', 'Sneaker chạy bộ – training với phối màu tím cam nổi bật như “nebula”. Đế cao su đệm dày êm chân, phần upper thoáng khí, form thể thao trẻ trung. Hợp mang đi tập – đi phố – đi học.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/download_14_wnzkv3.png', 624000.00, 480000.00, 23, 10, 0),
(42, 'GZ Black Tactical High-Top', 'Giày high-top đen full, vibe tactical mạnh mẽ. Upper da tổng hợp + đế bản lớn chắc chắn, cổ cao ôm cổ chân. Logo GZ đặt trước tăng điểm nhận diện. Phối đẹp với cargo – jogger.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/download_4_gvfknn.png', 624000.00, 480000.00, 23, 10, 0),
(43, 'GZ Classic Stiletto Heels (Black)', 'Giày cao gót mũi nhọn bóng sang trọng, form elegant. Gót cao thanh, ôm chân, phù hợp tiệc – công sở – event. Kiểu dáng basic timeless, dễ phối váy hoặc quần.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/c_fill,ar_4:3/v1763971235/download_9_i028ix.png', 624000.00, 480000.00, 23, 10, 0),
(44, 'GZ Aurora Runner – Pink/White', 'Sneaker chunky phối hồng pastel – trắng, đế cao, dáng trẻ trung. Form ôm chân, đệm êm, đi lâu thoải mái. Style nữ tính nhưng cá tính, hợp phối đồ streetwear lẫn casual.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971234/download_15_wpkcjo.png', 624000.00, 480000.00, 23, 10, 0),
(45, 'GZ Metallic Strap High Heels (Silver)', 'Cao gót dây kim loại ánh bạc, thiết kế thời trang – hiện đại. Chất liệu bóng nổi bật dưới ánh đèn. Hợp đi tiệc, event, photo shoot thời trang.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971233/download_13_ysxtmu.png', 624000.00, 480000.00, 23, 10, 0),
(46, 'GZ Pure White Minimal Sneakers', 'Sneaker trắng tối giản, form trơn cực clean. Chất liệu mềm, đế cao su dẻo chống trượt. Mang vibe “minimal luxury”, dễ phối mọi outfit từ đồ công sở đến streetwear.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971232/download_6_u2u5mt.png', 624000.00, 480000.00, 23, 10, 0),
(47, 'GZ Shadow White Leather Sneakers', 'Giày sneaker da trắng, đường nét mảnh – tinh tế. Đế liền form, nhẹ chân, phù hợp đi làm – đi học – đi chơi. Tone trắng sang, phù hợp cả nam & nữ.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971229/download_3_sgti8m.png', 624000.00, 480000.00, 23, 10, 0),
(48, 'GZ Street Warrior High-Top (Black/Red/White)', 'Giày high-top chiến binh với phối màu đen – đỏ – trắng cực ngầu. Dây đai khóa bản lớn tạo vibe combat. Đế cao su bám đường, form mạnh – hợp style hiphop/street.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971231/download_1_sluv5r.png', 624000.00, 480480.00, 23, 10, 0),
(49, 'GZ Casual Karambit Heels (Black)', 'Giày cao gót mũi nhọn bóng sang trọng, form elegant. Gót cao thanh, ôm chân, phù hợp tiệc – công sở – event. Kiểu dáng basic timeless, dễ phối váy hoặc quần.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971229/download_2_ljdoip.png', 624000.00, 480000.00, 23, 10, 0),
(50, 'GZ Washed Tactical Denim Set', 'Bộ denim wash loang phong cách tactical với form rộng cá tính. Áo khoác denim túi hộp lớn, đường wash bạc mạnh tạo hiệu ứng bụi – retro. Quần cargo denim đi kèm túi hộp, dây kéo và chi tiết viền chỉ nổi.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/GZ_Abyss_Wash_Cargo_Denim_fn1aaf.png', 624000.00, 480000.00, 23, 1, 0),
(51, 'GZ Casual Karambit Heels (Black)', 'Tracksuit vải nhung cao cấp, bề mặt bóng mờ sang trọng. Áo khoác zip form rộng – cổ cao – đường chỉ nổi tinh tế.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/GZ_Midnight_Velocity_Jacket_gwrla8.png', 624000.00, 499200.00, 20, 1, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_attributes`
--

CREATE TABLE `product_attributes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `size` varchar(50) DEFAULT NULL COMMENT 'Size sản phẩm (S, M, L, XL, 38, 39, 40, etc.)',
  `quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng tồn kho cho size/color này',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_attributes`
--

INSERT INTO `product_attributes` (`id`, `product_id`, `size`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 'S', 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(2, 1, 'M', 29, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(3, 1, 'L', 29, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(4, 1, 'XL', 29, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(5, 1, 'XXL', 29, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(6, 2, 'S', 42, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(7, 2, 'M', 39, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(8, 2, 'L', 39, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(9, 2, 'XL', 39, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(10, 2, 'XXL', 39, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(11, 3, 'S', 39, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(12, 3, 'M', 35, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(13, 3, 'L', 35, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(14, 3, 'XL', 35, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(15, 3, 'XXL', 35, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(16, 4, 'S', 24, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(17, 4, 'M', 24, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(18, 4, 'L', 24, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(19, 4, 'XL', 24, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(20, 4, 'XXL', 24, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(21, 5, 'S', 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(22, 5, 'M', 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(23, 5, 'L', 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(24, 5, 'XL', 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(25, 5, 'XXL', 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(26, 6, 'S', 30, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(27, 6, 'M', 30, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(28, 6, 'L', 30, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(29, 6, 'XL', 30, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(30, 6, 'XXL', 30, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(31, 7, 'S', 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(32, 7, 'M', 25, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(33, 7, 'L', 25, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(34, 7, 'XL', 25, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(35, 7, 'XXL', 25, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(36, 8, 'S', 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(37, 8, 'M', 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(38, 8, 'L', 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(39, 8, 'XL', 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(40, 8, 'XXL', 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(41, 9, 'S', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(42, 9, 'M', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(43, 9, 'L', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(44, 9, 'XL', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(45, 9, 'XXL', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(46, 10, 'S', 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(47, 10, 'M', 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(48, 10, 'L', 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(49, 10, 'XL', 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(50, 10, 'XXL', 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(51, 11, 'S', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(52, 11, 'M', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(53, 11, 'L', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(54, 11, 'XL', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(55, 11, 'XXL', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(56, 12, 'S', 34, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(57, 12, 'M', 34, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(58, 12, 'L', 34, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(59, 12, 'XL', 34, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(60, 12, 'XXL', 34, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(61, 13, 'S', 16, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(62, 13, 'M', 16, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(63, 13, 'L', 16, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(64, 13, 'XL', 16, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(65, 13, 'XXL', 16, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(66, 14, 'S', 14, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(67, 14, 'M', 14, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(68, 14, 'L', 14, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(69, 14, 'XL', 14, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(70, 14, 'XXL', 14, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(71, 15, 'S', 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(72, 15, 'M', 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(73, 15, 'L', 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(74, 15, 'XL', 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(75, 15, 'XXL', 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(76, 16, 'S', 17, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(77, 16, 'M', 17, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(78, 16, 'L', 17, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(79, 16, 'XL', 17, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(80, 16, 'XXL', 17, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(81, 17, 'S', 12, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(82, 17, 'M', 12, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(83, 17, 'L', 12, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(84, 17, 'XL', 12, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(85, 17, 'XXL', 12, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(86, 18, 'S', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(87, 18, 'M', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(88, 18, 'L', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(89, 18, 'XL', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(90, 18, 'XXL', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(91, 19, 'S', 27, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(92, 19, 'M', 23, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(93, 19, 'L', 23, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(94, 19, 'XL', 23, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(95, 19, 'XXL', 23, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(96, 21, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(97, 21, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(98, 21, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(99, 21, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(100, 21, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(101, 22, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(102, 22, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(103, 22, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(104, 22, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(105, 22, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(106, 23, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(107, 23, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(108, 23, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(109, 23, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(110, 23, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(111, 24, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(112, 24, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(113, 24, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(114, 24, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(115, 24, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(116, 25, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(117, 25, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(118, 25, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(119, 25, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(120, 25, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(121, 26, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(122, 26, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(123, 26, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(124, 26, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(125, 26, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(126, 27, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(127, 27, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(128, 27, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(129, 27, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(130, 27, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(131, 28, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(132, 28, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(133, 28, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(134, 28, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(135, 28, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(136, 29, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(137, 29, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(138, 29, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(139, 29, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(140, 29, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(141, 30, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(142, 30, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(143, 30, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(144, 30, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(145, 30, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(146, 31, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(147, 31, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(148, 31, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(149, 31, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(150, 31, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(151, 32, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(152, 32, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(153, 32, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(154, 32, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(155, 32, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(156, 33, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(157, 33, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(158, 33, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(159, 33, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(160, 33, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(161, 34, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(162, 34, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(163, 34, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(164, 34, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(165, 34, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(166, 35, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(167, 35, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(168, 35, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(169, 35, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(170, 35, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(171, 36, 'S', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(172, 36, 'M', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(173, 36, 'L', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(174, 36, 'XL', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(175, 36, 'XXL', 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(176, 37, 'S', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(177, 37, 'M', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(178, 37, 'L', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(179, 37, 'XL', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(180, 37, 'XXL', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(181, 38, 'S', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(182, 38, 'M', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(183, 38, 'L', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(184, 38, 'XL', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(185, 38, 'XXL', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(186, 39, 'S', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(187, 39, 'M', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(188, 39, 'L', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(189, 39, 'XL', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(190, 39, 'XXL', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(191, 40, 'S', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(192, 40, 'M', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(193, 40, 'L', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(194, 40, 'XL', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(195, 40, 'XXL', 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(196, 41, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(197, 41, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(198, 41, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(199, 41, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(200, 41, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(201, 42, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(202, 42, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(203, 42, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(204, 42, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(205, 42, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(206, 43, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(207, 43, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(208, 43, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(209, 43, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(210, 43, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(211, 44, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(212, 44, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(213, 44, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(214, 44, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(215, 44, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(216, 45, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(217, 45, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(218, 45, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(219, 45, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(220, 45, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(221, 46, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(222, 46, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(223, 46, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(224, 46, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(225, 46, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(226, 47, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(227, 47, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(228, 47, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(229, 47, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(230, 47, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(236, 49, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(237, 49, 'M', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(238, 49, 'L', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(239, 49, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(240, 49, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(241, 50, 'S', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(242, 50, 'M', 1, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(243, 50, 'L', 0, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(244, 50, 'XL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(245, 50, 'XXL', 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(258, 51, 'L', 0, '2025-12-04 01:58:39', '2025-12-04 01:58:39'),
(259, 51, 'M', 0, '2025-12-04 01:58:39', '2025-12-04 01:58:39'),
(260, 51, 'S', 2, '2025-12-04 01:58:39', '2025-12-04 01:58:39'),
(261, 51, 'XL', 2, '2025-12-04 01:58:39', '2025-12-04 01:58:39'),
(262, 51, 'XXL', 3, '2025-12-04 01:58:39', '2025-12-04 01:58:39'),
(283, 48, 'L', 1, '2025-12-08 16:48:41', '2025-12-08 16:48:41'),
(284, 48, 'M', 2, '2025-12-08 16:48:41', '2025-12-08 16:48:41'),
(285, 48, 'S', 2, '2025-12-08 16:48:41', '2025-12-08 16:48:41'),
(286, 48, 'XL', 2, '2025-12-08 16:48:41', '2025-12-08 16:48:41'),
(287, 48, 'XXL', 2, '2025-12-08 16:48:41', '2025-12-08 16:48:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `content` text DEFAULT NULL,
  `admin_reply` text DEFAULT NULL COMMENT 'Phản hồi từ admin',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0: Ẩn, 1: Hiển thị',
  `admin_replied_at` timestamp NULL DEFAULT NULL COMMENT 'Thời gian admin phản hồi',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_user` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 is user,1 is admin',
  `address` varchar(255) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `status_user` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 is enable,1 is disable',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role_user`, `address`, `phone`, `status_user`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin Fashion', 'admin@fashionstore.com', '2024-01-15 01:00:00', '$2y$12$uH73TUeDWtVdnfpS/f7McOsV250Rb7SGjoIScbjaGkHdWumesE9x.', 1, '123 Nguyễn Huệ, Quận 1, TP.HCM', '0901234567', 0, NULL, '2024-01-15 01:00:00', '2025-11-17 18:58:33'),
(2, 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '2024-02-01 03:30:00', '$2y$12$oack1h5tmKgWxUgWpO2bJuTblsfqWjsxsTLo0A3QLxyu4gbfCiAq6', 0, '456 Lê Lợi, Quận 1, TP.HCM', '0912345678', 0, NULL, '2024-02-01 03:30:00', '2025-11-17 18:58:27'),
(3, 'Trần Thị Bình', 'tranthibinh@gmail.com', '2024-02-05 07:20:00', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, '789 Võ Văn Tần, Quận 3, TP.HCM', '0923456789', 0, NULL, '2024-02-05 07:20:00', '2024-02-05 07:20:00'),
(4, 'Lê Hoàng Cường', 'lehoangcuong@gmail.com', '2024-02-10 02:15:00', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, '321 Hai Bà Trưng, Quận 3, TP.HCM', '0934567890', 0, NULL, '2024-02-10 02:15:00', '2024-02-10 02:15:00'),
(5, 'Phạm Thị Diệu', 'phamthidieu@gmail.com', '2024-02-15 04:45:00', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, '654 Trần Hưng Đạo, Quận 5, TP.HCM', '0945678901', 0, NULL, '2024-02-15 04:45:00', '2024-02-15 04:45:00'),
(6, 'Hoàng Văn Em', 'hoangvanem@gmail.com', '2024-02-20 06:30:00', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, '987 Phan Xích Long, Phú Nhuận, TP.HCM', '0956789012', 0, NULL, '2024-02-20 06:30:00', '2024-02-20 06:30:00'),
(7, 'Vũ Thị Phượng', 'vuthiphuong@gmail.com', '2024-02-25 08:00:00', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, '147 Điện Biên Phủ, Bình Thạnh, TP.HCM', '0967890123', 0, NULL, '2024-02-25 08:00:00', '2024-02-25 08:00:00'),
(8, 'Đỗ Minh Giang', 'dominggiang@gmail.com', '2024-03-01 01:30:00', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, '258 Cách Mạng Tháng 8, Quận 10, TP.HCM', '0978901234', 0, NULL, '2024-03-01 01:30:00', '2024-03-01 01:30:00'),
(9, 'Bùi Thị Hoa', 'buithihoa@gmail.com', '2024-03-05 03:00:00', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, '369 Nguyễn Thị Minh Khai, Quận 1, TP.HCM', '0989012345', 0, NULL, '2024-03-05 03:00:00', '2024-03-05 03:00:00'),
(10, 'Ngô Văn Ích', 'ngovanich@gmail.com', '2024-03-10 05:30:00', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, '741 Lý Thường Kiệt, Quận 11, TP.HCM', '0990123456', 0, NULL, '2024-03-10 05:30:00', '2024-03-10 05:30:00'),
(11, 'Nguyễn Văn A', 'nguyenvanc@gmail.com', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, '416/BB ấp Bờ Bàu, xã Mỹ Chánh, huyện Ba Tri, tỉnh Bến Tre', '0990123457', 0, NULL, '2025-11-18 23:15:27', '2025-11-18 23:38:08'),
(13, 'Huỳnh Gia Huy', 'huynhgiahuy2k4@gmail.com', NULL, '$2y$12$NC3gH0oLUNSOSi7N7u2uteI/HRO5HuJImi6l6gpp6SyQ69ZP.T7gW', 0, 'Abc', '0332279075', 0, NULL, '2025-12-08 17:33:34', '2025-12-08 17:34:29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

CREATE TABLE `vouchers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL COMMENT 'Mã voucher',
  `name` varchar(255) NOT NULL COMMENT 'Tên voucher',
  `description` text DEFAULT NULL COMMENT 'Mô tả',
  `type` enum('percent','fixed') NOT NULL DEFAULT 'percent' COMMENT 'Loại: phần trăm hoặc số tiền cố định',
  `value` decimal(15,2) NOT NULL COMMENT 'Giá trị giảm (phần trăm hoặc số tiền)',
  `min_order_amount` decimal(15,2) DEFAULT 0.00 COMMENT 'Đơn hàng tối thiểu',
  `max_discount_amount` decimal(15,2) DEFAULT NULL COMMENT 'Giảm tối đa (cho loại percent)',
  `usage_limit` int(11) DEFAULT NULL COMMENT 'Giới hạn số lần sử dụng (null = không giới hạn)',
  `used_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lần đã sử dụng',
  `start_date` datetime NOT NULL COMMENT 'Ngày bắt đầu',
  `end_date` datetime NOT NULL COMMENT 'Ngày kết thúc',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Trạng thái hoạt động',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `name`, `description`, `type`, `value`, `min_order_amount`, `max_discount_amount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'GIAM10', 'Giảm 10% cho đơn hàng từ 500.000₫', 'Áp dụng cho tất cả sản phẩm, giảm tối đa 100.000₫', 'percent', 10.00, 500000.00, 100000.00, 100, 0, '2025-11-27 07:18:38', '2026-01-03 07:18:38', 1, '2025-12-04 00:18:38', '2025-12-04 00:18:38'),
(2, 'GIAM50K', 'Giảm 50.000₫ cho đơn hàng từ 300.000₫', 'Giảm trực tiếp 50.000₫ cho đơn hàng', 'fixed', 50000.00, 300000.00, NULL, 200, 3, '2025-11-29 07:18:38', '2025-12-24 07:18:38', 1, '2025-12-04 00:18:38', '2025-12-04 00:18:38'),
(3, 'GIAM20', 'Giảm 20% cho đơn hàng từ 1.000.000₫', 'Áp dụng cho tất cả sản phẩm, giảm tối đa 200.000₫', 'percent', 20.00, 1000000.00, 200000.00, 50, 0, '2025-12-01 07:18:38', '2025-12-19 07:18:38', 1, '2025-12-04 00:18:38', '2025-12-04 00:18:38'),
(4, 'FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí vận chuyển cho đơn hàng từ 200.000₫', 'fixed', 30000.00, 200000.00, NULL, NULL, 0, '2025-11-24 07:18:38', '2026-02-02 07:18:38', 1, '2025-12-04 00:18:38', '2025-12-04 00:18:38');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wishlists`
--

CREATE TABLE `wishlists` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `created_at`, `updated_at`) VALUES
(2, 2, 50, '2025-12-08 16:39:18', '2025-12-08 16:39:18'),
(3, 2, 48, '2025-12-08 16:54:31', '2025-12-08 16:54:31');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `banners_position_status_order_index` (`position`,`status`,`order`);

--
-- Chỉ mục cho bảng `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product_id_carts_to_products` (`product_id`),
  ADD KEY `fk_user_id_carts_to_users` (`user_id`),
  ADD KEY `idx_carts_user` (`user_id`),
  ADD KEY `idx_carts_product` (`product_id`),
  ADD KEY `idx_carts_user_product` (`user_id`,`product_id`),
  ADD KEY `carts_product_attribute_id_foreign` (`product_attribute_id`);

--
-- Chỉ mục cho bảng `categories_product`
--
ALTER TABLE `categories_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_categories_status` (`status_category`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id_orders_to_users` (`user_id`),
  ADD KEY `idx_orders_user` (`user_id`),
  ADD KEY `idx_orders_status` (`status_order`),
  ADD KEY `idx_orders_delivery` (`status_delivery`),
  ADD KEY `idx_orders_user_status` (`status_user_order`),
  ADD KEY `idx_orders_status_delivery` (`status_order`,`status_delivery`),
  ADD KEY `orders_voucher_id_index` (`voucher_id`);

--
-- Chỉ mục cho bảng `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_id_order_details_to_orders` (`order_id`),
  ADD KEY `fk_product_id_order_details_to_products` (`product_id`),
  ADD KEY `idx_order_details_order` (`order_id`),
  ADD KEY `idx_order_details_product` (`product_id`),
  ADD KEY `idx_order_details_order_product` (`order_id`,`product_id`),
  ADD KEY `order_details_product_attribute_id_foreign` (`product_attribute_id`);

--
-- Chỉ mục cho bảng `password_reset_otps`
--
ALTER TABLE `password_reset_otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `password_reset_otps_email_index` (`email`),
  ADD KEY `password_reset_otps_reset_token_index` (`reset_token`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_category_id_products_to_categories_product` (`category_id`),
  ADD KEY `idx_products_status` (`status_product`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_status_category` (`status_product`,`category_id`);

--
-- Chỉ mục cho bảng `product_attributes`
--
ALTER TABLE `product_attributes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_attributes_product_id_size_color_index` (`product_id`,`size`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reviews_user` (`user_id`),
  ADD KEY `idx_reviews_product` (`product_id`),
  ADD KEY `idx_reviews_rating` (`rating`),
  ADD KEY `reviews_order_id_index` (`order_id`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vouchers_code_unique` (`code`),
  ADD KEY `vouchers_code_is_active_index` (`code`,`is_active`),
  ADD KEY `vouchers_start_date_end_date_index` (`start_date`,`end_date`);

--
-- Chỉ mục cho bảng `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product_wishlist` (`user_id`,`product_id`),
  ADD KEY `idx_wishlists_user` (`user_id`),
  ADD KEY `idx_wishlists_product` (`product_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT cho bảng `categories_product`
--
ALTER TABLE `categories_product`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT cho bảng `password_reset_otps`
--
ALTER TABLE `password_reset_otps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT cho bảng `product_attributes`
--
ALTER TABLE `product_attributes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=288;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_product_attribute_id_foreign` FOREIGN KEY (`product_attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_product_id_carts_to_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `fk_user_id_carts_to_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_user_id_orders_to_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_voucher_id_foreign` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `fk_order_id_order_details_to_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `fk_product_id_order_details_to_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `order_details_product_attribute_id_foreign` FOREIGN KEY (`product_attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_category_id_products_to_categories_product` FOREIGN KEY (`category_id`) REFERENCES `categories_product` (`id`);

--
-- Các ràng buộc cho bảng `product_attributes`
--
ALTER TABLE `product_attributes`
  ADD CONSTRAINT `product_attributes_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
