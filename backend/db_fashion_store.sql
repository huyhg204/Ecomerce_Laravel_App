-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 04, 2025 lúc 03:34 PM
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
-- Cấu trúc bảng cho bảng `attribute_options`
--

CREATE TABLE `attribute_options` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(50) NOT NULL,
  `value` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_categories_all', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:11:{i:0;O:8:\"stdClass\":4:{s:2:\"id\";i:11;s:13:\"name_category\";s:14:\"ádasdasdasdad\";s:14:\"image_category\";s:39:\"uploads/categories/1763993321_image.png\";s:15:\"status_category\";i:1;}i:1;O:8:\"stdClass\":4:{s:2:\"id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:14:\"image_category\";s:23:\"categories/giay-dep.jpg\";s:15:\"status_category\";i:0;}i:2;O:8:\"stdClass\":4:{s:2:\"id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:14:\"image_category\";s:23:\"categories/phu-kien.jpg\";s:15:\"status_category\";i:0;}i:3;O:8:\"stdClass\":4:{s:2:\"id\";i:8;s:13:\"name_category\";s:11:\"Đồ Ngủ\";s:14:\"image_category\";s:21:\"categories/do-ngu.jpg\";s:15:\"status_category\";i:0;}i:4;O:8:\"stdClass\":4:{s:2:\"id\";i:7;s:13:\"name_category\";s:16:\"Đồ Thể Thao\";s:14:\"image_category\";s:26:\"categories/do-the-thao.jpg\";s:15:\"status_category\";i:0;}i:5;O:8:\"stdClass\":4:{s:2:\"id\";i:6;s:13:\"name_category\";s:10:\"Áo Khoác\";s:14:\"image_category\";s:23:\"categories/ao-khoac.jpg\";s:15:\"status_category\";i:0;}i:6;O:8:\"stdClass\":4:{s:2:\"id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:14:\"image_category\";s:22:\"categories/vay-dam.jpg\";s:15:\"status_category\";i:0;}i:7;O:8:\"stdClass\":4:{s:2:\"id\";i:4;s:13:\"name_category\";s:11:\"Quần Nữ\";s:14:\"image_category\";s:22:\"categories/quan-nu.jpg\";s:15:\"status_category\";i:0;}i:8;O:8:\"stdClass\":4:{s:2:\"id\";i:3;s:13:\"name_category\";s:10:\"Quần Nam\";s:14:\"image_category\";s:23:\"categories/quan-nam.jpg\";s:15:\"status_category\";i:0;}i:9;O:8:\"stdClass\":4:{s:2:\"id\";i:2;s:13:\"name_category\";s:8:\"Áo Nữ\";s:14:\"image_category\";s:20:\"categories/ao-nu.jpg\";s:15:\"status_category\";i:0;}i:10;O:8:\"stdClass\":4:{s:2:\"id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:14:\"image_category\";s:21:\"categories/ao-nam.jpg\";s:15:\"status_category\";i:0;}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1764859182),
('laravel_cache_dashboard_top_products_2025-12-04_day', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:1:{i:0;O:8:\"stdClass\":6:{s:10:\"product_id\";i:51;s:12:\"name_product\";s:32:\"GZ Casual Karambit Heels (Black)\";s:13:\"image_product\";s:100:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/GZ_Midnight_Velocity_Jacket_gwrla8.png\";s:13:\"price_product\";d:499200;s:13:\"quantity_sold\";s:1:\"6\";s:13:\"total_revenue\";d:2880000;}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1764858780),
('laravel_cache_dashboard_total_orders_2025-12-04_day', 'i:3;', 1764858180),
('laravel_cache_dashboard_total_products', 'i:51;', 1764858180),
('laravel_cache_dashboard_total_revenue_2025-12-04_day', 'd:2780000;', 1764858180),
('laravel_cache_dashboard_total_users', 'i:11;', 1764858180),
('laravel_cache_products_admin_page_1_perpage_1000', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:52:{i:0;O:8:\"stdClass\":14:{s:2:\"id\";i:52;s:12:\"name_product\";s:12:\"xxxxxxxxxsdd\";s:13:\"price_product\";d:900000;s:19:\"description_product\";s:11:\"sssssssssss\";s:13:\"image_product\";s:38:\"uploads/products/1763993310_avatar.png\";s:16:\"quantity_product\";i:123;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:10:\"1000000.00\";s:14:\"discount_price\";s:9:\"900000.00\";s:16:\"discount_percent\";i:10;}i:1;O:8:\"stdClass\":14:{s:2:\"id\";i:51;s:12:\"name_product\";s:32:\"GZ Casual Karambit Heels (Black)\";s:13:\"price_product\";d:499200;s:19:\"description_product\";s:145:\"Tracksuit vải nhung cao cấp, bề mặt bóng mờ sang trọng. Áo khoác zip form rộng – cổ cao – đường chỉ nổi tinh tế.\";s:13:\"image_product\";s:100:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/GZ_Midnight_Velocity_Jacket_gwrla8.png\";s:16:\"quantity_product\";i:4;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:1;s:14:\"average_rating\";s:3:\"5.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"499200.00\";s:16:\"discount_percent\";i:20;}i:2;O:8:\"stdClass\":14:{s:2:\"id\";i:50;s:12:\"name_product\";s:28:\"GZ Washed Tactical Denim Set\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:255:\"Bộ denim wash loang phong cách tactical với form rộng cá tính. Áo khoác denim túi hộp lớn, đường wash bạc mạnh tạo hiệu ứng bụi – retro. Quần cargo denim đi kèm túi hộp, dây kéo và chi tiết viền chỉ nổi.\";s:13:\"image_product\";s:98:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/GZ_Abyss_Wash_Cargo_Denim_fn1aaf.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:3;O:8:\"stdClass\":14:{s:2:\"id\";i:49;s:12:\"name_product\";s:32:\"GZ Casual Karambit Heels (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:192:\"Giày cao gót mũi nhọn bóng sang trọng, form elegant. Gót cao thanh, ôm chân, phù hợp tiệc – công sở – event. Kiểu dáng basic timeless, dễ phối váy hoặc quần.\";s:13:\"image_product\";s:97:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971229/download_2_ljdoip.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:4;O:8:\"stdClass\":14:{s:2:\"id\";i:48;s:12:\"name_product\";s:44:\"GZ Street Warrior High-Top (Black/Red/White)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:205:\"Giày high-top chiến binh với phối màu đen – đỏ – trắng cực ngầu. Dây đai khóa bản lớn tạo vibe combat. Đế cao su bám đường, form mạnh – hợp style hiphop/street.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971231/download_1_sluv5r.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:5;O:8:\"stdClass\":14:{s:2:\"id\";i:47;s:12:\"name_product\";s:32:\"GZ Shadow White Leather Sneakers\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:190:\"Giày sneaker da trắng, đường nét mảnh – tinh tế. Đế liền form, nhẹ chân, phù hợp đi làm – đi học – đi chơi. Tone trắng sang, phù hợp cả nam & nữ.\";s:13:\"image_product\";s:97:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971229/download_3_sgti8m.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:6;O:8:\"stdClass\":14:{s:2:\"id\";i:46;s:12:\"name_product\";s:30:\"GZ Pure White Minimal Sneakers\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:209:\"Sneaker trắng tối giản, form trơn cực clean. Chất liệu mềm, đế cao su dẻo chống trượt. Mang vibe “minimal luxury”, dễ phối mọi outfit từ đồ công sở đến streetwear.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971232/download_6_u2u5mt.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:7;O:8:\"stdClass\":14:{s:2:\"id\";i:45;s:12:\"name_product\";s:37:\"GZ Metallic Strap High Heels (Silver)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:184:\"Cao gót dây kim loại ánh bạc, thiết kế thời trang – hiện đại. Chất liệu bóng nổi bật dưới ánh đèn. Hợp đi tiệc, event, photo shoot thời trang.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971233/download_13_ysxtmu.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:8;O:8:\"stdClass\":14:{s:2:\"id\";i:44;s:12:\"name_product\";s:31:\"GZ Aurora Runner – Pink/White\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:208:\"Sneaker chunky phối hồng pastel – trắng, đế cao, dáng trẻ trung. Form ôm chân, đệm êm, đi lâu thoải mái. Style nữ tính nhưng cá tính, hợp phối đồ streetwear lẫn casual.\";s:13:\"image_product\";s:98:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971234/download_15_wpkcjo.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:9;O:8:\"stdClass\":14:{s:2:\"id\";i:43;s:12:\"name_product\";s:33:\"GZ Classic Stiletto Heels (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:192:\"Giày cao gót mũi nhọn bóng sang trọng, form elegant. Gót cao thanh, ôm chân, phù hợp tiệc – công sở – event. Kiểu dáng basic timeless, dễ phối váy hoặc quần.\";s:13:\"image_product\";s:97:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_fill,ar_4:3/v1763971235/download_9_i028ix.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:10;O:8:\"stdClass\":14:{s:2:\"id\";i:42;s:12:\"name_product\";s:26:\"GZ Black Tactical High-Top\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:225:\"Giày high-top đen full, vibe tactical mạnh mẽ. Upper da tổng hợp + đế bản lớn chắc chắn, cổ cao ôm cổ chân. Logo GZ đặt trước tăng điểm nhận diện. Phối đẹp với cargo – jogger.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/download_4_gvfknn.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:11;O:8:\"stdClass\":14:{s:2:\"id\";i:41;s:12:\"name_product\";s:34:\"GZ Nebula Runner – Purple/Orange\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:232:\"Sneaker chạy bộ – training với phối màu tím cam nổi bật như “nebula”. Đế cao su đệm dày êm chân, phần upper thoáng khí, form thể thao trẻ trung. Hợp mang đi tập – đi phố – đi học.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/download_14_wnzkv3.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:12;O:8:\"stdClass\":14:{s:2:\"id\";i:40;s:12:\"name_product\";s:36:\"GZ Indigo Wide-Leg Denim Skirt-Pants\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:174:\"Thiết kế dạng quần ống rộng nhưng mô phỏng chân váy, màu denim indigo đậm. Form rộng cực thoải mái, phong cách Nhật – streetwear – unisex.\";s:13:\"image_product\";s:128:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/150925.hades3151_large_489341173b344d3db9cd03fb3968685a_f5d1s8.jpg\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:3;s:13:\"name_category\";s:10:\"Quần Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:13;O:8:\"stdClass\":14:{s:2:\"id\";i:39;s:12:\"name_product\";s:27:\"GZ Desert Canvas Mini Skirt\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:162:\"Váy canvas màu nâu military, có dây rút – chi tiết rách nhẹ kiểu tactical. Mang phong cách độc lạ, phù hợp nữ cá tính yêu streetwear.\";s:13:\"image_product\";s:120:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/dsc03116_large_5a43f0478dc74eb49b48b090be289ae6_wmyhcc.jpg\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:14;O:8:\"stdClass\":14:{s:2:\"id\";i:38;s:12:\"name_product\";s:28:\"GZ Flow Motion Skirt (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:150:\"Váy xoè mỏng nhẹ hơn, độ xoè mềm tạo kiểu “bay gió” rất đẹp khi chụp ảnh. Dễ mix cùng áo đen – xám – croptop.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_7_ujsgbj.png\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:15;O:8:\"stdClass\":14:{s:2:\"id\";i:37;s:12:\"name_product\";s:20:\"GZ Round Flare Skirt\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:145:\"Váy xoè rộng bo tròn, chuyển động đẹp khi đi lại. Mang vibe nữ tính – hiện đại. Phối được casual lẫn cá tính.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_10_xoyasx.png\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:16;O:8:\"stdClass\":14:{s:2:\"id\";i:36;s:12:\"name_product\";s:22:\"GZ Core Hoodie (Black)\";s:13:\"price_product\";d:350000;s:19:\"description_product\";s:193:\"Hoodie đen form rộng, logo GZ trắng trước ngực. Chất nỉ dày mềm, ấm và thoải mái. Mặc đi học – đi làm – đi chơi đều hợp, mix được mọi phong cách.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_2_njpyho.png\";s:16:\"quantity_product\";i:90;s:14:\"status_product\";i:0;s:11:\"category_id\";i:6;s:13:\"name_category\";s:10:\"Áo Khoác\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"455000.00\";s:14:\"discount_price\";s:9:\"350000.00\";s:16:\"discount_percent\";i:23;}i:17;O:8:\"stdClass\":14:{s:2:\"id\";i:35;s:12:\"name_product\";s:30:\"GZ Field Utility Sling (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:195:\"Túi chéo tactical đen với form hộp vuông, nhiều ngăn nhỏ. Thân túi chống sờn, dây đai chắc chắn, phù hợp người thích phong cách lính – outdoor – utilitarian.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971230/download_3_wnqc6o.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:18;O:8:\"stdClass\":14:{s:2:\"id\";i:34;s:12:\"name_product\";s:26:\"GZ Compact Sidebag (Coral)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:188:\"Túi màu cam đất độc lạ, thiết kế tối giản – điểm nhấn logo GZ kim loại trước. Dây đeo mềm, điều chỉnh dễ. Phù hợp đi chơi, dạo phố, café.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971231/download_12_rw5lgx.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:19;O:8:\"stdClass\":14:{s:2:\"id\";i:33;s:12:\"name_product\";s:28:\"GZ Urban Mini Sling (Yellow)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:231:\"Túi đeo chéo mini màu vàng trẻ trung, hiện đại. Form vuông bo cạnh mềm mại, logo GZ đúc nổi ấn tượng. Nhỏ gọn nhưng đủ chứa đồ cá nhân. Hợp phối outfit streetwear – casual – daily.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/download_11_zzicvw.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:20;O:8:\"stdClass\":14:{s:2:\"id\";i:32;s:12:\"name_product\";s:19:\"GZ Wilderness Cargo\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:214:\"Phiên bản nâu vintage với nhiều ngăn hộp kiểu cargo. Cảm giác “thám hiểm – dã ngoại”. Vải canvas dày, dây đai lớn, khóa bền. Thiết kế phù hợp du lịch, studio, outdoor.\";s:13:\"image_product\";s:93:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971245/GZ_Ravage_Cargo_Pack_vch4ei.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:21;O:8:\"stdClass\":14:{s:2:\"id\";i:31;s:12:\"name_product\";s:17:\"GZ Recon X-Series\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:245:\"Balo 3 tầng với hệ dây chéo X đặc trưng. Tạo điểm nhấn mạnh – khác biệt – đậm chất tactical. Màu rêu quân đội, ngăn trong rộng, chịu ma sát tốt. Phù hợp dân đi tour, đi rừng, phượt thủ.\";s:13:\"image_product\";s:90:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971246/GZ_Ruin_Haul_Pack_tpcilb.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:22;O:8:\"stdClass\":14:{s:2:\"id\";i:30;s:12:\"name_product\";s:17:\"GZ Black Ops Pack\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:237:\"Tone đen full, khí chất mạnh mẽ như đồ lính đặc nhiệm. Form vuông – dây đai – khóa kim loại tạo độ “đầm”. Khoang chứa rộng, chịu tải tốt, bền bỉ cho cả công việc lẫn du lịch.\";s:13:\"image_product\";s:95:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971246/GZ_Payload_Hauler_Pack_osodpf.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:23;O:8:\"stdClass\":14:{s:2:\"id\";i:29;s:12:\"name_product\";s:21:\"GZ Desert Ranger Pack\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:228:\"Balo phong cách lính desert, tone nâu vintage cực ngầu. Chất liệu canvas dày, nhiều ngăn phụ, dây kéo chắc chắn. Thích hợp trekking, đi phố, chụp hình phong cách thợ săn – retro – outdoor.\";s:13:\"image_product\";s:92:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971247/GZ_System_Tech_Pack_p36rs3.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:24;O:8:\"stdClass\":14:{s:2:\"id\";i:28;s:12:\"name_product\";s:13:\"GZ Nightstorm\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:214:\"Form mũ tactical đen với nhiều chi tiết cắt chỉ và điểm rách đối xứng. Lưỡi trai cong vừa phải, đội thoải mái cả ngày. Giữ được vibe phủi bụi, nam tính, mạnh mẽ.\";s:13:\"image_product\";s:99:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/GZ_Oblivion_Distressed_Cap_vsqt3u.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:25;O:8:\"stdClass\":14:{s:2:\"id\";i:27;s:12:\"name_product\";s:13:\"GZ Streetcore\";s:13:\"price_product\";d:650000;s:19:\"description_product\";s:249:\"Mũ phong cách tactical nhẹ, các chi tiết rách nhẹ và cắt lớp mang vibe lính – đường phố. Logo GZ mini tinh tế. Form cứng chắc, phù hợp hoạt động ngoài trời, du lịch, chụp hình phong cách “darkwear”.\";s:13:\"image_product\";s:104:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971240/GZ_Oblivion_Distressed_Ball_Cap_cd5itv.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"845000.00\";s:14:\"discount_price\";s:9:\"650000.00\";s:16:\"discount_percent\";i:23;}i:26;O:8:\"stdClass\":14:{s:2:\"id\";i:26;s:12:\"name_product\";s:12:\"GZ Rebel Cap\";s:13:\"price_product\";d:580000;s:19:\"description_product\";s:182:\"Mũ tone đen với phần rách sâu và logo GZ kim loại tone xám khói. Tạo phong cách underground mạnh, hợp với áo phông tối màu, áo khoác denim hoặc bomber.\";s:13:\"image_product\";s:90:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971242/GZ_Ruin_Decon_Cap_vaeui2.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"754000.00\";s:14:\"discount_price\";s:9:\"580000.00\";s:16:\"discount_percent\";i:23;}i:27;O:8:\"stdClass\":14:{s:2:\"id\";i:25;s:12:\"name_product\";s:22:\"GZ Tactical Titan Pack\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:277:\"Balo tactical dung tích lớn, thiết kế đa ngăn kiểu quân đội. Chất liệu vải dày chống sờn, dây đai chắc – khóa kim loại bền. Vibe cực mạnh cho người thích du lịch, phượt, công việc outdoor. Logo GZ gắn trước nổi bật.\";s:13:\"image_product\";s:104:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971248/GZ_System_Overload_Utility_Pack_j0lxh7.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:28;O:8:\"stdClass\":14:{s:2:\"id\";i:24;s:12:\"name_product\";s:18:\"GZ Urban Destroyed\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:225:\"Điểm nhấn là logo GZ kim loại dạng mảng lớn, đi cùng đường chỉ “bung chỉ giả\" mang vibe street phá cách. Chất liệu mềm – uốn form đẹp – rách nghệ thuật tạo cá tính riêng.\";s:13:\"image_product\";s:95:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971243/GZ_Oblivion_Stitch_Cap_aexrzv.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:29;O:8:\"stdClass\":14:{s:2:\"id\";i:23;s:12:\"name_product\";s:19:\"GZ Blackout Edition\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:253:\"Thiết kế tối giản, mạnh mẽ với các chi tiết scratch rải nhẹ. Logo GZ dạng kim loại mảnh tạo phong cách “đô thị tối giản” hiện đại. Phù hợp nam nữ, thích hợp đi chơi – đi phố – chụp hình.\";s:13:\"image_product\";s:91:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971243/GZ_Shadow_Brim_Cap_a4bc3x.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:30;O:8:\"stdClass\":14:{s:2:\"id\";i:22;s:12:\"name_product\";s:14:\"GZ Street Torn\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:237:\"Mũ lưỡi trai đen với điểm rách nhẹ tinh tế, logo GZ thêu 3D nổi bật. Form cứng cáp, dễ phối mọi outfit từ casual tới streetstyle. Đai khóa sau điều chỉnh linh hoạt, đội ôm đầu, không bí.\";s:13:\"image_product\";s:93:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971244/GZ_Oblivion_Echo_Cap_c21ybf.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:31;O:8:\"stdClass\":14:{s:2:\"id\";i:21;s:12:\"name_product\";s:13:\"GZ Shadow Cap\";s:13:\"price_product\";d:450000;s:19:\"description_product\";s:324:\"Mũ len phong cách destroyed cá tính với các đường tua thô cố ý, tạo cảm giác bụi và phá cách. Chất len dày form ôm đầu, giữ ấm tốt nhưng vẫn thoáng khí. Logo GZ dệt nổi phía trước tạo điểm nhấn mạnh mẽ. Phù hợp streetwear, mix đồ layer, áo hoodie, jacket.\";s:13:\"image_product\";s:93:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971248/GZ_Oblivion_Knit_Cap_chllx9.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"585000.00\";s:14:\"discount_price\";s:9:\"450000.00\";s:16:\"discount_percent\";i:23;}i:32;O:8:\"stdClass\":14:{s:2:\"id\";i:20;s:12:\"name_product\";s:20:\"Bộ Đồ Yoga Nữ\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:50:\"Bộ đồ yoga nữ co giãn 4 chiều, ôm dáng\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:1;s:11:\"category_id\";i:7;s:13:\"name_category\";s:16:\"Đồ Thể Thao\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";N;s:14:\"discount_price\";N;s:16:\"discount_percent\";i:0;}i:33;O:8:\"stdClass\":14:{s:2:\"id\";i:19;s:12:\"name_product\";s:25:\"Bộ Đồ Thể Thao Nam\";s:13:\"price_product\";d:550000;s:19:\"description_product\";s:61:\"Bộ đồ thể thao nam chất liệu thấm hút mồ hôi\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:119;s:14:\"status_product\";i:0;s:11:\"category_id\";i:7;s:13:\"name_category\";s:16:\"Đồ Thể Thao\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"715000.00\";s:14:\"discount_price\";s:9:\"550000.00\";s:16:\"discount_percent\";i:23;}i:34;O:8:\"stdClass\":14:{s:2:\"id\";i:18;s:12:\"name_product\";s:12:\"Áo Gió Nam\";s:13:\"price_product\";d:450000;s:19:\"description_product\";s:69:\"Áo gió nam chống nước, phù hợp hoạt động ngoài trời\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:94;s:14:\"status_product\";i:0;s:11:\"category_id\";i:6;s:13:\"name_category\";s:10:\"Áo Khoác\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"585000.00\";s:14:\"discount_price\";s:9:\"450000.00\";s:16:\"discount_percent\";i:23;}i:35;O:8:\"stdClass\":14:{s:2:\"id\";i:17;s:12:\"name_product\";s:20:\"Áo Khoác Dạ Nữ\";s:13:\"price_product\";d:950000;s:19:\"description_product\";s:56:\"Áo khoác dạ nữ ấm áp, thiết kế sang trọng\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:60;s:14:\"status_product\";i:0;s:11:\"category_id\";i:6;s:13:\"name_category\";s:10:\"Áo Khoác\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:10:\"1235000.00\";s:14:\"discount_price\";s:9:\"950000.00\";s:16:\"discount_percent\";i:23;}i:36;O:8:\"stdClass\":14:{s:2:\"id\";i:16;s:12:\"name_product\";s:20:\"Áo Khoác Jeans Nam\";s:13:\"price_product\";d:650000;s:19:\"description_product\";s:46:\"Áo khoác jeans nam phong cách năng động\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:85;s:14:\"status_product\";i:0;s:11:\"category_id\";i:6;s:13:\"name_category\";s:10:\"Áo Khoác\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"845000.00\";s:14:\"discount_price\";s:9:\"650000.00\";s:16:\"discount_percent\";i:23;}i:37;O:8:\"stdClass\":14:{s:2:\"id\";i:15;s:12:\"name_product\";s:20:\"Váy Chữ A Trắng\";s:13:\"price_product\";d:350000;s:19:\"description_product\";s:59:\"Váy chữ A dáng xòe trẻ trung, phù hợp dạo phố\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:100;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"455000.00\";s:14:\"discount_price\";s:9:\"350000.00\";s:16:\"discount_percent\";i:23;}i:38;O:8:\"stdClass\":14:{s:2:\"id\";i:14;s:12:\"name_product\";s:22:\"Đầm Công Sở Đen\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:57:\"Đầm công sở thiết kế đơn giản, thanh lịch\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:70;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:39;O:8:\"stdClass\":14:{s:2:\"id\";i:13;s:12:\"name_product\";s:18:\"Váy Maxi Hoa Dài\";s:13:\"price_product\";d:520000;s:19:\"description_product\";s:57:\"Váy maxi hoa dạo phố, thiết kế xòe nhẹ nhàng\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:80;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"676000.00\";s:14:\"discount_price\";s:9:\"520000.00\";s:16:\"discount_percent\";i:23;}i:40;O:8:\"stdClass\":14:{s:2:\"id\";i:12;s:12:\"name_product\";s:23:\"Quần Short Nữ Vải\";s:13:\"price_product\";d:220000;s:19:\"description_product\";s:64:\"Quần short nữ dáng suông thoải mái, phù hợp mùa hè\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:170;s:14:\"status_product\";i:0;s:11:\"category_id\";i:4;s:13:\"name_category\";s:11:\"Quần Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"286000.00\";s:14:\"discount_price\";s:9:\"220000.00\";s:16:\"discount_percent\";i:23;}i:41;O:8:\"stdClass\":14:{s:2:\"id\";i:11;s:12:\"name_product\";s:21:\"Quần Tây Nữ Đen\";s:13:\"price_product\";d:350000;s:19:\"description_product\";s:67:\"Quần tây nữ công sở, thiết kế ống suông thanh lịch\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:90;s:14:\"status_product\";i:0;s:11:\"category_id\";i:4;s:13:\"name_category\";s:11:\"Quần Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"455000.00\";s:14:\"discount_price\";s:9:\"350000.00\";s:16:\"discount_percent\";i:23;}i:42;O:8:\"stdClass\":14:{s:2:\"id\";i:10;s:12:\"name_product\";s:29:\"Quần Jeans Nữ Rách Gối\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:62:\"Quần jeans nữ phong cách cá tính, rách nhẹ ở gối\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:160;s:14:\"status_product\";i:0;s:11:\"category_id\";i:4;s:13:\"name_category\";s:11:\"Quần Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:43;O:8:\"stdClass\":14:{s:2:\"id\";i:9;s:12:\"name_product\";s:19:\"Quần Âu Nam Đen\";s:13:\"price_product\";d:420000;s:19:\"description_product\";s:59:\"Quần âu nam công sở, form chuẩn, vải không nhăn\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:3;s:13:\"name_category\";s:10:\"Quần Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"546000.00\";s:14:\"discount_price\";s:9:\"420000.00\";s:16:\"discount_percent\";i:23;}i:44;O:8:\"stdClass\":14:{s:2:\"id\";i:8;s:12:\"name_product\";s:18:\"Quần Kaki Nam Be\";s:13:\"price_product\";d:380000;s:19:\"description_product\";s:56:\"Quần kaki nam form regular, chất liệu thoáng mát\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:140;s:14:\"status_product\";i:0;s:11:\"category_id\";i:3;s:13:\"name_category\";s:10:\"Quần Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"494000.00\";s:14:\"discount_price\";s:9:\"380000.00\";s:16:\"discount_percent\";i:23;}i:45;O:8:\"stdClass\":14:{s:2:\"id\";i:7;s:12:\"name_product\";s:28:\"Quần Jeans Nam Xanh Đậm\";s:13:\"price_product\";d:450000;s:19:\"description_product\";s:67:\"Quần jeans nam dáng slim fit, chất liệu denim co giãn nhẹ\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:128;s:14:\"status_product\";i:0;s:11:\"category_id\";i:3;s:13:\"name_category\";s:10:\"Quần Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"585000.00\";s:14:\"discount_price\";s:9:\"450000.00\";s:16:\"discount_percent\";i:23;}i:46;O:8:\"stdClass\":14:{s:2:\"id\";i:6;s:12:\"name_product\";s:24:\"Áo Croptop Nữ Trắng\";s:13:\"price_product\";d:180000;s:19:\"description_product\";s:55:\"Áo croptop nữ phong cách trẻ trung, năng động\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:150;s:14:\"status_product\";i:0;s:11:\"category_id\";i:2;s:13:\"name_category\";s:8:\"Áo Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"234000.00\";s:14:\"discount_price\";s:9:\"180000.00\";s:16:\"discount_percent\";i:23;}i:47;O:8:\"stdClass\":14:{s:2:\"id\";i:5;s:12:\"name_product\";s:34:\"Áo Sơ Mi Nữ Trắng Công Sở\";s:13:\"price_product\";d:320000;s:19:\"description_product\";s:80:\"Áo sơ mi nữ thiết kế thanh lịch, phù hợp môi trường văn phòng\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:100;s:14:\"status_product\";i:0;s:11:\"category_id\";i:2;s:13:\"name_category\";s:8:\"Áo Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"416000.00\";s:14:\"discount_price\";s:9:\"320000.00\";s:16:\"discount_percent\";i:23;}i:48;O:8:\"stdClass\":14:{s:2:\"id\";i:4;s:12:\"name_product\";s:24:\"Áo Kiểu Nữ Hoa Nhí\";s:13:\"price_product\";d:280000;s:19:\"description_product\";s:81:\"Áo kiểu nữ họa tiết hoa nhí dịu dàng, chất liệu voan mềm mại\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:120;s:14:\"status_product\";i:0;s:11:\"category_id\";i:2;s:13:\"name_category\";s:8:\"Áo Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"364000.00\";s:14:\"discount_price\";s:9:\"280000.00\";s:16:\"discount_percent\";i:23;}i:49;O:8:\"stdClass\":14:{s:2:\"id\";i:3;s:12:\"name_product\";s:22:\"Áo Polo Nam Xanh Navy\";s:13:\"price_product\";d:250000;s:19:\"description_product\";s:68:\"Áo polo nam chất liệu pique cotton, thấm hút mồ hôi tốt\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:179;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"325000.00\";s:14:\"discount_price\";s:9:\"250000.00\";s:16:\"discount_percent\";i:23;}i:50;O:8:\"stdClass\":14:{s:2:\"id\";i:2;s:12:\"name_product\";s:23:\"Áo Thun Nam Basic Đen\";s:13:\"price_product\";d:150000;s:19:\"description_product\";s:69:\"Áo thun nam chất liệu cotton 100%, form regular fit thoải mái\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:198;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"195000.00\";s:14:\"discount_price\";s:9:\"150000.00\";s:16:\"discount_percent\";i:23;}i:51;O:8:\"stdClass\":14:{s:2:\"id\";i:1;s:12:\"name_product\";s:29:\"Áo Sơ Mi Nam Trắng Oxford\";s:13:\"price_product\";d:350000;s:19:\"description_product\";s:109:\"Áo sơ mi nam chất liệu cotton cao cấp, thiết kế cổ điển, phù hợp đi làm và dự tiệc\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:148;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"455000.00\";s:14:\"discount_price\";s:9:\"350000.00\";s:16:\"discount_percent\";i:23;}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1764859136);
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_products_public_page_1_perpage_1000', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:51:{i:0;O:8:\"stdClass\":14:{s:2:\"id\";i:52;s:12:\"name_product\";s:12:\"xxxxxxxxxsdd\";s:13:\"price_product\";d:900000;s:19:\"description_product\";s:11:\"sssssssssss\";s:13:\"image_product\";s:38:\"uploads/products/1763993310_avatar.png\";s:16:\"quantity_product\";i:123;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:10:\"1000000.00\";s:14:\"discount_price\";s:9:\"900000.00\";s:16:\"discount_percent\";i:10;}i:1;O:8:\"stdClass\":14:{s:2:\"id\";i:51;s:12:\"name_product\";s:32:\"GZ Casual Karambit Heels (Black)\";s:13:\"price_product\";d:499200;s:19:\"description_product\";s:145:\"Tracksuit vải nhung cao cấp, bề mặt bóng mờ sang trọng. Áo khoác zip form rộng – cổ cao – đường chỉ nổi tinh tế.\";s:13:\"image_product\";s:100:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/GZ_Midnight_Velocity_Jacket_gwrla8.png\";s:16:\"quantity_product\";i:4;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:1;s:14:\"average_rating\";s:3:\"5.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"499200.00\";s:16:\"discount_percent\";i:20;}i:2;O:8:\"stdClass\":14:{s:2:\"id\";i:50;s:12:\"name_product\";s:28:\"GZ Washed Tactical Denim Set\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:255:\"Bộ denim wash loang phong cách tactical với form rộng cá tính. Áo khoác denim túi hộp lớn, đường wash bạc mạnh tạo hiệu ứng bụi – retro. Quần cargo denim đi kèm túi hộp, dây kéo và chi tiết viền chỉ nổi.\";s:13:\"image_product\";s:98:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/GZ_Abyss_Wash_Cargo_Denim_fn1aaf.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:3;O:8:\"stdClass\":14:{s:2:\"id\";i:49;s:12:\"name_product\";s:32:\"GZ Casual Karambit Heels (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:192:\"Giày cao gót mũi nhọn bóng sang trọng, form elegant. Gót cao thanh, ôm chân, phù hợp tiệc – công sở – event. Kiểu dáng basic timeless, dễ phối váy hoặc quần.\";s:13:\"image_product\";s:97:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971229/download_2_ljdoip.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:4;O:8:\"stdClass\":14:{s:2:\"id\";i:48;s:12:\"name_product\";s:44:\"GZ Street Warrior High-Top (Black/Red/White)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:205:\"Giày high-top chiến binh với phối màu đen – đỏ – trắng cực ngầu. Dây đai khóa bản lớn tạo vibe combat. Đế cao su bám đường, form mạnh – hợp style hiphop/street.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971231/download_1_sluv5r.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:5;O:8:\"stdClass\":14:{s:2:\"id\";i:47;s:12:\"name_product\";s:32:\"GZ Shadow White Leather Sneakers\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:190:\"Giày sneaker da trắng, đường nét mảnh – tinh tế. Đế liền form, nhẹ chân, phù hợp đi làm – đi học – đi chơi. Tone trắng sang, phù hợp cả nam & nữ.\";s:13:\"image_product\";s:97:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971229/download_3_sgti8m.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:6;O:8:\"stdClass\":14:{s:2:\"id\";i:46;s:12:\"name_product\";s:30:\"GZ Pure White Minimal Sneakers\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:209:\"Sneaker trắng tối giản, form trơn cực clean. Chất liệu mềm, đế cao su dẻo chống trượt. Mang vibe “minimal luxury”, dễ phối mọi outfit từ đồ công sở đến streetwear.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971232/download_6_u2u5mt.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:7;O:8:\"stdClass\":14:{s:2:\"id\";i:45;s:12:\"name_product\";s:37:\"GZ Metallic Strap High Heels (Silver)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:184:\"Cao gót dây kim loại ánh bạc, thiết kế thời trang – hiện đại. Chất liệu bóng nổi bật dưới ánh đèn. Hợp đi tiệc, event, photo shoot thời trang.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971233/download_13_ysxtmu.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:8;O:8:\"stdClass\":14:{s:2:\"id\";i:44;s:12:\"name_product\";s:31:\"GZ Aurora Runner – Pink/White\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:208:\"Sneaker chunky phối hồng pastel – trắng, đế cao, dáng trẻ trung. Form ôm chân, đệm êm, đi lâu thoải mái. Style nữ tính nhưng cá tính, hợp phối đồ streetwear lẫn casual.\";s:13:\"image_product\";s:98:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971234/download_15_wpkcjo.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:9;O:8:\"stdClass\":14:{s:2:\"id\";i:43;s:12:\"name_product\";s:33:\"GZ Classic Stiletto Heels (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:192:\"Giày cao gót mũi nhọn bóng sang trọng, form elegant. Gót cao thanh, ôm chân, phù hợp tiệc – công sở – event. Kiểu dáng basic timeless, dễ phối váy hoặc quần.\";s:13:\"image_product\";s:97:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_fill,ar_4:3/v1763971235/download_9_i028ix.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:10;O:8:\"stdClass\":14:{s:2:\"id\";i:42;s:12:\"name_product\";s:26:\"GZ Black Tactical High-Top\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:225:\"Giày high-top đen full, vibe tactical mạnh mẽ. Upper da tổng hợp + đế bản lớn chắc chắn, cổ cao ôm cổ chân. Logo GZ đặt trước tăng điểm nhận diện. Phối đẹp với cargo – jogger.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/download_4_gvfknn.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:11;O:8:\"stdClass\":14:{s:2:\"id\";i:41;s:12:\"name_product\";s:34:\"GZ Nebula Runner – Purple/Orange\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:232:\"Sneaker chạy bộ – training với phối màu tím cam nổi bật như “nebula”. Đế cao su đệm dày êm chân, phần upper thoáng khí, form thể thao trẻ trung. Hợp mang đi tập – đi phố – đi học.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/download_14_wnzkv3.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:12;O:8:\"stdClass\":14:{s:2:\"id\";i:40;s:12:\"name_product\";s:36:\"GZ Indigo Wide-Leg Denim Skirt-Pants\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:174:\"Thiết kế dạng quần ống rộng nhưng mô phỏng chân váy, màu denim indigo đậm. Form rộng cực thoải mái, phong cách Nhật – streetwear – unisex.\";s:13:\"image_product\";s:128:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/150925.hades3151_large_489341173b344d3db9cd03fb3968685a_f5d1s8.jpg\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:3;s:13:\"name_category\";s:10:\"Quần Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:13;O:8:\"stdClass\":14:{s:2:\"id\";i:39;s:12:\"name_product\";s:27:\"GZ Desert Canvas Mini Skirt\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:162:\"Váy canvas màu nâu military, có dây rút – chi tiết rách nhẹ kiểu tactical. Mang phong cách độc lạ, phù hợp nữ cá tính yêu streetwear.\";s:13:\"image_product\";s:120:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/dsc03116_large_5a43f0478dc74eb49b48b090be289ae6_wmyhcc.jpg\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:14;O:8:\"stdClass\":14:{s:2:\"id\";i:38;s:12:\"name_product\";s:28:\"GZ Flow Motion Skirt (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:150:\"Váy xoè mỏng nhẹ hơn, độ xoè mềm tạo kiểu “bay gió” rất đẹp khi chụp ảnh. Dễ mix cùng áo đen – xám – croptop.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_7_ujsgbj.png\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:15;O:8:\"stdClass\":14:{s:2:\"id\";i:37;s:12:\"name_product\";s:20:\"GZ Round Flare Skirt\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:145:\"Váy xoè rộng bo tròn, chuyển động đẹp khi đi lại. Mang vibe nữ tính – hiện đại. Phối được casual lẫn cá tính.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_10_xoyasx.png\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:16;O:8:\"stdClass\":14:{s:2:\"id\";i:36;s:12:\"name_product\";s:22:\"GZ Core Hoodie (Black)\";s:13:\"price_product\";d:350000;s:19:\"description_product\";s:193:\"Hoodie đen form rộng, logo GZ trắng trước ngực. Chất nỉ dày mềm, ấm và thoải mái. Mặc đi học – đi làm – đi chơi đều hợp, mix được mọi phong cách.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_2_njpyho.png\";s:16:\"quantity_product\";i:90;s:14:\"status_product\";i:0;s:11:\"category_id\";i:6;s:13:\"name_category\";s:10:\"Áo Khoác\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"455000.00\";s:14:\"discount_price\";s:9:\"350000.00\";s:16:\"discount_percent\";i:23;}i:17;O:8:\"stdClass\":14:{s:2:\"id\";i:35;s:12:\"name_product\";s:30:\"GZ Field Utility Sling (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:195:\"Túi chéo tactical đen với form hộp vuông, nhiều ngăn nhỏ. Thân túi chống sờn, dây đai chắc chắn, phù hợp người thích phong cách lính – outdoor – utilitarian.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971230/download_3_wnqc6o.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:18;O:8:\"stdClass\":14:{s:2:\"id\";i:34;s:12:\"name_product\";s:26:\"GZ Compact Sidebag (Coral)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:188:\"Túi màu cam đất độc lạ, thiết kế tối giản – điểm nhấn logo GZ kim loại trước. Dây đeo mềm, điều chỉnh dễ. Phù hợp đi chơi, dạo phố, café.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971231/download_12_rw5lgx.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:19;O:8:\"stdClass\":14:{s:2:\"id\";i:33;s:12:\"name_product\";s:28:\"GZ Urban Mini Sling (Yellow)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:231:\"Túi đeo chéo mini màu vàng trẻ trung, hiện đại. Form vuông bo cạnh mềm mại, logo GZ đúc nổi ấn tượng. Nhỏ gọn nhưng đủ chứa đồ cá nhân. Hợp phối outfit streetwear – casual – daily.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/download_11_zzicvw.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:20;O:8:\"stdClass\":14:{s:2:\"id\";i:32;s:12:\"name_product\";s:19:\"GZ Wilderness Cargo\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:214:\"Phiên bản nâu vintage với nhiều ngăn hộp kiểu cargo. Cảm giác “thám hiểm – dã ngoại”. Vải canvas dày, dây đai lớn, khóa bền. Thiết kế phù hợp du lịch, studio, outdoor.\";s:13:\"image_product\";s:93:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971245/GZ_Ravage_Cargo_Pack_vch4ei.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:21;O:8:\"stdClass\":14:{s:2:\"id\";i:31;s:12:\"name_product\";s:17:\"GZ Recon X-Series\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:245:\"Balo 3 tầng với hệ dây chéo X đặc trưng. Tạo điểm nhấn mạnh – khác biệt – đậm chất tactical. Màu rêu quân đội, ngăn trong rộng, chịu ma sát tốt. Phù hợp dân đi tour, đi rừng, phượt thủ.\";s:13:\"image_product\";s:90:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971246/GZ_Ruin_Haul_Pack_tpcilb.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:22;O:8:\"stdClass\":14:{s:2:\"id\";i:30;s:12:\"name_product\";s:17:\"GZ Black Ops Pack\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:237:\"Tone đen full, khí chất mạnh mẽ như đồ lính đặc nhiệm. Form vuông – dây đai – khóa kim loại tạo độ “đầm”. Khoang chứa rộng, chịu tải tốt, bền bỉ cho cả công việc lẫn du lịch.\";s:13:\"image_product\";s:95:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971246/GZ_Payload_Hauler_Pack_osodpf.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:23;O:8:\"stdClass\":14:{s:2:\"id\";i:29;s:12:\"name_product\";s:21:\"GZ Desert Ranger Pack\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:228:\"Balo phong cách lính desert, tone nâu vintage cực ngầu. Chất liệu canvas dày, nhiều ngăn phụ, dây kéo chắc chắn. Thích hợp trekking, đi phố, chụp hình phong cách thợ săn – retro – outdoor.\";s:13:\"image_product\";s:92:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971247/GZ_System_Tech_Pack_p36rs3.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:24;O:8:\"stdClass\":14:{s:2:\"id\";i:28;s:12:\"name_product\";s:13:\"GZ Nightstorm\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:214:\"Form mũ tactical đen với nhiều chi tiết cắt chỉ và điểm rách đối xứng. Lưỡi trai cong vừa phải, đội thoải mái cả ngày. Giữ được vibe phủi bụi, nam tính, mạnh mẽ.\";s:13:\"image_product\";s:99:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/GZ_Oblivion_Distressed_Cap_vsqt3u.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:25;O:8:\"stdClass\":14:{s:2:\"id\";i:27;s:12:\"name_product\";s:13:\"GZ Streetcore\";s:13:\"price_product\";d:650000;s:19:\"description_product\";s:249:\"Mũ phong cách tactical nhẹ, các chi tiết rách nhẹ và cắt lớp mang vibe lính – đường phố. Logo GZ mini tinh tế. Form cứng chắc, phù hợp hoạt động ngoài trời, du lịch, chụp hình phong cách “darkwear”.\";s:13:\"image_product\";s:104:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971240/GZ_Oblivion_Distressed_Ball_Cap_cd5itv.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"845000.00\";s:14:\"discount_price\";s:9:\"650000.00\";s:16:\"discount_percent\";i:23;}i:26;O:8:\"stdClass\":14:{s:2:\"id\";i:26;s:12:\"name_product\";s:12:\"GZ Rebel Cap\";s:13:\"price_product\";d:580000;s:19:\"description_product\";s:182:\"Mũ tone đen với phần rách sâu và logo GZ kim loại tone xám khói. Tạo phong cách underground mạnh, hợp với áo phông tối màu, áo khoác denim hoặc bomber.\";s:13:\"image_product\";s:90:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971242/GZ_Ruin_Decon_Cap_vaeui2.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"754000.00\";s:14:\"discount_price\";s:9:\"580000.00\";s:16:\"discount_percent\";i:23;}i:27;O:8:\"stdClass\":14:{s:2:\"id\";i:25;s:12:\"name_product\";s:22:\"GZ Tactical Titan Pack\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:277:\"Balo tactical dung tích lớn, thiết kế đa ngăn kiểu quân đội. Chất liệu vải dày chống sờn, dây đai chắc – khóa kim loại bền. Vibe cực mạnh cho người thích du lịch, phượt, công việc outdoor. Logo GZ gắn trước nổi bật.\";s:13:\"image_product\";s:104:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971248/GZ_System_Overload_Utility_Pack_j0lxh7.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:28;O:8:\"stdClass\":14:{s:2:\"id\";i:24;s:12:\"name_product\";s:18:\"GZ Urban Destroyed\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:225:\"Điểm nhấn là logo GZ kim loại dạng mảng lớn, đi cùng đường chỉ “bung chỉ giả\" mang vibe street phá cách. Chất liệu mềm – uốn form đẹp – rách nghệ thuật tạo cá tính riêng.\";s:13:\"image_product\";s:95:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971243/GZ_Oblivion_Stitch_Cap_aexrzv.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:29;O:8:\"stdClass\":14:{s:2:\"id\";i:23;s:12:\"name_product\";s:19:\"GZ Blackout Edition\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:253:\"Thiết kế tối giản, mạnh mẽ với các chi tiết scratch rải nhẹ. Logo GZ dạng kim loại mảnh tạo phong cách “đô thị tối giản” hiện đại. Phù hợp nam nữ, thích hợp đi chơi – đi phố – chụp hình.\";s:13:\"image_product\";s:91:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971243/GZ_Shadow_Brim_Cap_a4bc3x.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:30;O:8:\"stdClass\":14:{s:2:\"id\";i:22;s:12:\"name_product\";s:14:\"GZ Street Torn\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:237:\"Mũ lưỡi trai đen với điểm rách nhẹ tinh tế, logo GZ thêu 3D nổi bật. Form cứng cáp, dễ phối mọi outfit từ casual tới streetstyle. Đai khóa sau điều chỉnh linh hoạt, đội ôm đầu, không bí.\";s:13:\"image_product\";s:93:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971244/GZ_Oblivion_Echo_Cap_c21ybf.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:31;O:8:\"stdClass\":14:{s:2:\"id\";i:21;s:12:\"name_product\";s:13:\"GZ Shadow Cap\";s:13:\"price_product\";d:450000;s:19:\"description_product\";s:324:\"Mũ len phong cách destroyed cá tính với các đường tua thô cố ý, tạo cảm giác bụi và phá cách. Chất len dày form ôm đầu, giữ ấm tốt nhưng vẫn thoáng khí. Logo GZ dệt nổi phía trước tạo điểm nhấn mạnh mẽ. Phù hợp streetwear, mix đồ layer, áo hoodie, jacket.\";s:13:\"image_product\";s:93:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971248/GZ_Oblivion_Knit_Cap_chllx9.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"585000.00\";s:14:\"discount_price\";s:9:\"450000.00\";s:16:\"discount_percent\";i:23;}i:32;O:8:\"stdClass\":14:{s:2:\"id\";i:19;s:12:\"name_product\";s:25:\"Bộ Đồ Thể Thao Nam\";s:13:\"price_product\";d:550000;s:19:\"description_product\";s:61:\"Bộ đồ thể thao nam chất liệu thấm hút mồ hôi\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:119;s:14:\"status_product\";i:0;s:11:\"category_id\";i:7;s:13:\"name_category\";s:16:\"Đồ Thể Thao\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"715000.00\";s:14:\"discount_price\";s:9:\"550000.00\";s:16:\"discount_percent\";i:23;}i:33;O:8:\"stdClass\":14:{s:2:\"id\";i:18;s:12:\"name_product\";s:12:\"Áo Gió Nam\";s:13:\"price_product\";d:450000;s:19:\"description_product\";s:69:\"Áo gió nam chống nước, phù hợp hoạt động ngoài trời\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:94;s:14:\"status_product\";i:0;s:11:\"category_id\";i:6;s:13:\"name_category\";s:10:\"Áo Khoác\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"585000.00\";s:14:\"discount_price\";s:9:\"450000.00\";s:16:\"discount_percent\";i:23;}i:34;O:8:\"stdClass\":14:{s:2:\"id\";i:17;s:12:\"name_product\";s:20:\"Áo Khoác Dạ Nữ\";s:13:\"price_product\";d:950000;s:19:\"description_product\";s:56:\"Áo khoác dạ nữ ấm áp, thiết kế sang trọng\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:60;s:14:\"status_product\";i:0;s:11:\"category_id\";i:6;s:13:\"name_category\";s:10:\"Áo Khoác\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:10:\"1235000.00\";s:14:\"discount_price\";s:9:\"950000.00\";s:16:\"discount_percent\";i:23;}i:35;O:8:\"stdClass\":14:{s:2:\"id\";i:16;s:12:\"name_product\";s:20:\"Áo Khoác Jeans Nam\";s:13:\"price_product\";d:650000;s:19:\"description_product\";s:46:\"Áo khoác jeans nam phong cách năng động\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:85;s:14:\"status_product\";i:0;s:11:\"category_id\";i:6;s:13:\"name_category\";s:10:\"Áo Khoác\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"845000.00\";s:14:\"discount_price\";s:9:\"650000.00\";s:16:\"discount_percent\";i:23;}i:36;O:8:\"stdClass\":14:{s:2:\"id\";i:15;s:12:\"name_product\";s:20:\"Váy Chữ A Trắng\";s:13:\"price_product\";d:350000;s:19:\"description_product\";s:59:\"Váy chữ A dáng xòe trẻ trung, phù hợp dạo phố\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:100;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"455000.00\";s:14:\"discount_price\";s:9:\"350000.00\";s:16:\"discount_percent\";i:23;}i:37;O:8:\"stdClass\":14:{s:2:\"id\";i:14;s:12:\"name_product\";s:22:\"Đầm Công Sở Đen\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:57:\"Đầm công sở thiết kế đơn giản, thanh lịch\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:70;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:38;O:8:\"stdClass\":14:{s:2:\"id\";i:13;s:12:\"name_product\";s:18:\"Váy Maxi Hoa Dài\";s:13:\"price_product\";d:520000;s:19:\"description_product\";s:57:\"Váy maxi hoa dạo phố, thiết kế xòe nhẹ nhàng\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:80;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"676000.00\";s:14:\"discount_price\";s:9:\"520000.00\";s:16:\"discount_percent\";i:23;}i:39;O:8:\"stdClass\":14:{s:2:\"id\";i:12;s:12:\"name_product\";s:23:\"Quần Short Nữ Vải\";s:13:\"price_product\";d:220000;s:19:\"description_product\";s:64:\"Quần short nữ dáng suông thoải mái, phù hợp mùa hè\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:170;s:14:\"status_product\";i:0;s:11:\"category_id\";i:4;s:13:\"name_category\";s:11:\"Quần Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"286000.00\";s:14:\"discount_price\";s:9:\"220000.00\";s:16:\"discount_percent\";i:23;}i:40;O:8:\"stdClass\":14:{s:2:\"id\";i:11;s:12:\"name_product\";s:21:\"Quần Tây Nữ Đen\";s:13:\"price_product\";d:350000;s:19:\"description_product\";s:67:\"Quần tây nữ công sở, thiết kế ống suông thanh lịch\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:90;s:14:\"status_product\";i:0;s:11:\"category_id\";i:4;s:13:\"name_category\";s:11:\"Quần Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"455000.00\";s:14:\"discount_price\";s:9:\"350000.00\";s:16:\"discount_percent\";i:23;}i:41;O:8:\"stdClass\":14:{s:2:\"id\";i:10;s:12:\"name_product\";s:29:\"Quần Jeans Nữ Rách Gối\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:62:\"Quần jeans nữ phong cách cá tính, rách nhẹ ở gối\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:160;s:14:\"status_product\";i:0;s:11:\"category_id\";i:4;s:13:\"name_category\";s:11:\"Quần Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:42;O:8:\"stdClass\":14:{s:2:\"id\";i:9;s:12:\"name_product\";s:19:\"Quần Âu Nam Đen\";s:13:\"price_product\";d:420000;s:19:\"description_product\";s:59:\"Quần âu nam công sở, form chuẩn, vải không nhăn\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:3;s:13:\"name_category\";s:10:\"Quần Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"546000.00\";s:14:\"discount_price\";s:9:\"420000.00\";s:16:\"discount_percent\";i:23;}i:43;O:8:\"stdClass\":14:{s:2:\"id\";i:8;s:12:\"name_product\";s:18:\"Quần Kaki Nam Be\";s:13:\"price_product\";d:380000;s:19:\"description_product\";s:56:\"Quần kaki nam form regular, chất liệu thoáng mát\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:140;s:14:\"status_product\";i:0;s:11:\"category_id\";i:3;s:13:\"name_category\";s:10:\"Quần Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"494000.00\";s:14:\"discount_price\";s:9:\"380000.00\";s:16:\"discount_percent\";i:23;}i:44;O:8:\"stdClass\":14:{s:2:\"id\";i:7;s:12:\"name_product\";s:28:\"Quần Jeans Nam Xanh Đậm\";s:13:\"price_product\";d:450000;s:19:\"description_product\";s:67:\"Quần jeans nam dáng slim fit, chất liệu denim co giãn nhẹ\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:128;s:14:\"status_product\";i:0;s:11:\"category_id\";i:3;s:13:\"name_category\";s:10:\"Quần Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"585000.00\";s:14:\"discount_price\";s:9:\"450000.00\";s:16:\"discount_percent\";i:23;}i:45;O:8:\"stdClass\":14:{s:2:\"id\";i:6;s:12:\"name_product\";s:24:\"Áo Croptop Nữ Trắng\";s:13:\"price_product\";d:180000;s:19:\"description_product\";s:55:\"Áo croptop nữ phong cách trẻ trung, năng động\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:150;s:14:\"status_product\";i:0;s:11:\"category_id\";i:2;s:13:\"name_category\";s:8:\"Áo Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"234000.00\";s:14:\"discount_price\";s:9:\"180000.00\";s:16:\"discount_percent\";i:23;}i:46;O:8:\"stdClass\":14:{s:2:\"id\";i:5;s:12:\"name_product\";s:34:\"Áo Sơ Mi Nữ Trắng Công Sở\";s:13:\"price_product\";d:320000;s:19:\"description_product\";s:80:\"Áo sơ mi nữ thiết kế thanh lịch, phù hợp môi trường văn phòng\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:100;s:14:\"status_product\";i:0;s:11:\"category_id\";i:2;s:13:\"name_category\";s:8:\"Áo Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"416000.00\";s:14:\"discount_price\";s:9:\"320000.00\";s:16:\"discount_percent\";i:23;}i:47;O:8:\"stdClass\":14:{s:2:\"id\";i:4;s:12:\"name_product\";s:24:\"Áo Kiểu Nữ Hoa Nhí\";s:13:\"price_product\";d:280000;s:19:\"description_product\";s:81:\"Áo kiểu nữ họa tiết hoa nhí dịu dàng, chất liệu voan mềm mại\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:120;s:14:\"status_product\";i:0;s:11:\"category_id\";i:2;s:13:\"name_category\";s:8:\"Áo Nữ\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"364000.00\";s:14:\"discount_price\";s:9:\"280000.00\";s:16:\"discount_percent\";i:23;}i:48;O:8:\"stdClass\":14:{s:2:\"id\";i:3;s:12:\"name_product\";s:22:\"Áo Polo Nam Xanh Navy\";s:13:\"price_product\";d:250000;s:19:\"description_product\";s:68:\"Áo polo nam chất liệu pique cotton, thấm hút mồ hôi tốt\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:179;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"325000.00\";s:14:\"discount_price\";s:9:\"250000.00\";s:16:\"discount_percent\";i:23;}i:49;O:8:\"stdClass\":14:{s:2:\"id\";i:2;s:12:\"name_product\";s:23:\"Áo Thun Nam Basic Đen\";s:13:\"price_product\";d:150000;s:19:\"description_product\";s:69:\"Áo thun nam chất liệu cotton 100%, form regular fit thoải mái\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:198;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"195000.00\";s:14:\"discount_price\";s:9:\"150000.00\";s:16:\"discount_percent\";i:23;}i:50;O:8:\"stdClass\":14:{s:2:\"id\";i:1;s:12:\"name_product\";s:29:\"Áo Sơ Mi Nam Trắng Oxford\";s:13:\"price_product\";d:350000;s:19:\"description_product\";s:109:\"Áo sơ mi nam chất liệu cotton cao cấp, thiết kế cổ điển, phù hợp đi làm và dự tiệc\";s:13:\"image_product\";s:217:\"https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090\";s:16:\"quantity_product\";i:148;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"455000.00\";s:14:\"discount_price\";s:9:\"350000.00\";s:16:\"discount_percent\";i:23;}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1764856446);
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel_cache_products_public_page_1_perpage_20', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:20:{i:0;O:8:\"stdClass\":14:{s:2:\"id\";i:52;s:12:\"name_product\";s:12:\"xxxxxxxxxsdd\";s:13:\"price_product\";d:900000;s:19:\"description_product\";s:11:\"sssssssssss\";s:13:\"image_product\";s:38:\"uploads/products/1763993310_avatar.png\";s:16:\"quantity_product\";i:123;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:10:\"1000000.00\";s:14:\"discount_price\";s:9:\"900000.00\";s:16:\"discount_percent\";i:10;}i:1;O:8:\"stdClass\":14:{s:2:\"id\";i:51;s:12:\"name_product\";s:32:\"GZ Casual Karambit Heels (Black)\";s:13:\"price_product\";d:499200;s:19:\"description_product\";s:145:\"Tracksuit vải nhung cao cấp, bề mặt bóng mờ sang trọng. Áo khoác zip form rộng – cổ cao – đường chỉ nổi tinh tế.\";s:13:\"image_product\";s:100:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/GZ_Midnight_Velocity_Jacket_gwrla8.png\";s:16:\"quantity_product\";i:4;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:1;s:14:\"average_rating\";s:3:\"5.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"499200.00\";s:16:\"discount_percent\";i:20;}i:2;O:8:\"stdClass\":14:{s:2:\"id\";i:50;s:12:\"name_product\";s:28:\"GZ Washed Tactical Denim Set\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:255:\"Bộ denim wash loang phong cách tactical với form rộng cá tính. Áo khoác denim túi hộp lớn, đường wash bạc mạnh tạo hiệu ứng bụi – retro. Quần cargo denim đi kèm túi hộp, dây kéo và chi tiết viền chỉ nổi.\";s:13:\"image_product\";s:98:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/GZ_Abyss_Wash_Cargo_Denim_fn1aaf.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:1;s:13:\"name_category\";s:7:\"Áo Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:3;O:8:\"stdClass\":14:{s:2:\"id\";i:49;s:12:\"name_product\";s:32:\"GZ Casual Karambit Heels (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:192:\"Giày cao gót mũi nhọn bóng sang trọng, form elegant. Gót cao thanh, ôm chân, phù hợp tiệc – công sở – event. Kiểu dáng basic timeless, dễ phối váy hoặc quần.\";s:13:\"image_product\";s:97:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971229/download_2_ljdoip.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:4;O:8:\"stdClass\":14:{s:2:\"id\";i:48;s:12:\"name_product\";s:44:\"GZ Street Warrior High-Top (Black/Red/White)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:205:\"Giày high-top chiến binh với phối màu đen – đỏ – trắng cực ngầu. Dây đai khóa bản lớn tạo vibe combat. Đế cao su bám đường, form mạnh – hợp style hiphop/street.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971231/download_1_sluv5r.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:5;O:8:\"stdClass\":14:{s:2:\"id\";i:47;s:12:\"name_product\";s:32:\"GZ Shadow White Leather Sneakers\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:190:\"Giày sneaker da trắng, đường nét mảnh – tinh tế. Đế liền form, nhẹ chân, phù hợp đi làm – đi học – đi chơi. Tone trắng sang, phù hợp cả nam & nữ.\";s:13:\"image_product\";s:97:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971229/download_3_sgti8m.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:6;O:8:\"stdClass\":14:{s:2:\"id\";i:46;s:12:\"name_product\";s:30:\"GZ Pure White Minimal Sneakers\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:209:\"Sneaker trắng tối giản, form trơn cực clean. Chất liệu mềm, đế cao su dẻo chống trượt. Mang vibe “minimal luxury”, dễ phối mọi outfit từ đồ công sở đến streetwear.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971232/download_6_u2u5mt.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:7;O:8:\"stdClass\":14:{s:2:\"id\";i:45;s:12:\"name_product\";s:37:\"GZ Metallic Strap High Heels (Silver)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:184:\"Cao gót dây kim loại ánh bạc, thiết kế thời trang – hiện đại. Chất liệu bóng nổi bật dưới ánh đèn. Hợp đi tiệc, event, photo shoot thời trang.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971233/download_13_ysxtmu.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:8;O:8:\"stdClass\":14:{s:2:\"id\";i:44;s:12:\"name_product\";s:31:\"GZ Aurora Runner – Pink/White\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:208:\"Sneaker chunky phối hồng pastel – trắng, đế cao, dáng trẻ trung. Form ôm chân, đệm êm, đi lâu thoải mái. Style nữ tính nhưng cá tính, hợp phối đồ streetwear lẫn casual.\";s:13:\"image_product\";s:98:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971234/download_15_wpkcjo.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:9;O:8:\"stdClass\":14:{s:2:\"id\";i:43;s:12:\"name_product\";s:33:\"GZ Classic Stiletto Heels (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:192:\"Giày cao gót mũi nhọn bóng sang trọng, form elegant. Gót cao thanh, ôm chân, phù hợp tiệc – công sở – event. Kiểu dáng basic timeless, dễ phối váy hoặc quần.\";s:13:\"image_product\";s:97:\"https://res.cloudinary.com/dkpnat2ht/image/upload/c_fill,ar_4:3/v1763971235/download_9_i028ix.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:10;O:8:\"stdClass\":14:{s:2:\"id\";i:42;s:12:\"name_product\";s:26:\"GZ Black Tactical High-Top\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:225:\"Giày high-top đen full, vibe tactical mạnh mẽ. Upper da tổng hợp + đế bản lớn chắc chắn, cổ cao ôm cổ chân. Logo GZ đặt trước tăng điểm nhận diện. Phối đẹp với cargo – jogger.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/download_4_gvfknn.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:11;O:8:\"stdClass\":14:{s:2:\"id\";i:41;s:12:\"name_product\";s:34:\"GZ Nebula Runner – Purple/Orange\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:232:\"Sneaker chạy bộ – training với phối màu tím cam nổi bật như “nebula”. Đế cao su đệm dày êm chân, phần upper thoáng khí, form thể thao trẻ trung. Hợp mang đi tập – đi phố – đi học.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/download_14_wnzkv3.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:10;s:13:\"name_category\";s:10:\"Giày Dép\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:12;O:8:\"stdClass\":14:{s:2:\"id\";i:40;s:12:\"name_product\";s:36:\"GZ Indigo Wide-Leg Denim Skirt-Pants\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:174:\"Thiết kế dạng quần ống rộng nhưng mô phỏng chân váy, màu denim indigo đậm. Form rộng cực thoải mái, phong cách Nhật – streetwear – unisex.\";s:13:\"image_product\";s:128:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/150925.hades3151_large_489341173b344d3db9cd03fb3968685a_f5d1s8.jpg\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:3;s:13:\"name_category\";s:10:\"Quần Nam\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:13;O:8:\"stdClass\":14:{s:2:\"id\";i:39;s:12:\"name_product\";s:27:\"GZ Desert Canvas Mini Skirt\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:162:\"Váy canvas màu nâu military, có dây rút – chi tiết rách nhẹ kiểu tactical. Mang phong cách độc lạ, phù hợp nữ cá tính yêu streetwear.\";s:13:\"image_product\";s:120:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/dsc03116_large_5a43f0478dc74eb49b48b090be289ae6_wmyhcc.jpg\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:14;O:8:\"stdClass\":14:{s:2:\"id\";i:38;s:12:\"name_product\";s:28:\"GZ Flow Motion Skirt (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:150:\"Váy xoè mỏng nhẹ hơn, độ xoè mềm tạo kiểu “bay gió” rất đẹp khi chụp ảnh. Dễ mix cùng áo đen – xám – croptop.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_7_ujsgbj.png\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:15;O:8:\"stdClass\":14:{s:2:\"id\";i:37;s:12:\"name_product\";s:20:\"GZ Round Flare Skirt\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:145:\"Váy xoè rộng bo tròn, chuyển động đẹp khi đi lại. Mang vibe nữ tính – hiện đại. Phối được casual lẫn cá tính.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_10_xoyasx.png\";s:16:\"quantity_product\";i:110;s:14:\"status_product\";i:0;s:11:\"category_id\";i:5;s:13:\"name_category\";s:11:\"Váy Đầm\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:16;O:8:\"stdClass\":14:{s:2:\"id\";i:36;s:12:\"name_product\";s:22:\"GZ Core Hoodie (Black)\";s:13:\"price_product\";d:350000;s:19:\"description_product\";s:193:\"Hoodie đen form rộng, logo GZ trắng trước ngực. Chất nỉ dày mềm, ấm và thoải mái. Mặc đi học – đi làm – đi chơi đều hợp, mix được mọi phong cách.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_2_njpyho.png\";s:16:\"quantity_product\";i:90;s:14:\"status_product\";i:0;s:11:\"category_id\";i:6;s:13:\"name_category\";s:10:\"Áo Khoác\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"455000.00\";s:14:\"discount_price\";s:9:\"350000.00\";s:16:\"discount_percent\";i:23;}i:17;O:8:\"stdClass\":14:{s:2:\"id\";i:35;s:12:\"name_product\";s:30:\"GZ Field Utility Sling (Black)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:195:\"Túi chéo tactical đen với form hộp vuông, nhiều ngăn nhỏ. Thân túi chống sờn, dây đai chắc chắn, phù hợp người thích phong cách lính – outdoor – utilitarian.\";s:13:\"image_product\";s:83:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971230/download_3_wnqc6o.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:18;O:8:\"stdClass\":14:{s:2:\"id\";i:34;s:12:\"name_product\";s:26:\"GZ Compact Sidebag (Coral)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:188:\"Túi màu cam đất độc lạ, thiết kế tối giản – điểm nhấn logo GZ kim loại trước. Dây đeo mềm, điều chỉnh dễ. Phù hợp đi chơi, dạo phố, café.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971231/download_12_rw5lgx.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}i:19;O:8:\"stdClass\":14:{s:2:\"id\";i:33;s:12:\"name_product\";s:28:\"GZ Urban Mini Sling (Yellow)\";s:13:\"price_product\";d:480000;s:19:\"description_product\";s:231:\"Túi đeo chéo mini màu vàng trẻ trung, hiện đại. Form vuông bo cạnh mềm mại, logo GZ đúc nổi ấn tượng. Nhỏ gọn nhưng đủ chứa đồ cá nhân. Hợp phối outfit streetwear – casual – daily.\";s:13:\"image_product\";s:84:\"https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/download_11_zzicvw.png\";s:16:\"quantity_product\";i:10;s:14:\"status_product\";i:0;s:11:\"category_id\";i:9;s:13:\"name_category\";s:12:\"Phụ Kiện\";s:13:\"reviews_count\";i:0;s:14:\"average_rating\";s:3:\"0.0\";s:14:\"original_price\";s:9:\"624000.00\";s:14:\"discount_price\";s:9:\"480000.00\";s:16:\"discount_percent\";i:23;}}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1764858876),
('laravel_cache_products_total_admin', 'i:52;', 1764859136),
('laravel_cache_products_total_public', 'i:51;', 1764858876);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(34, 51, NULL, 'L', 2, 1, 480000);

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
-- Cấu trúc bảng cho bảng `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(15, 2, '2025-12-04 00:44:27', 0, 0, 480000, NULL, NULL, 0.00, NULL, '0912345678', '456 Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn An', NULL, NULL, NULL, NULL);

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
(32, 15, 51, NULL, 'L', 1, 480000);

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
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
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

--
-- Đang đổ dữ liệu cho bảng `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(68, 'App\\Models\\User', 1, 'authToken', '98fd9d405317a245bf17384953eb8b916d0691aef239c2cf1809ccb00df7cc15', '[\"*\"]', '2025-11-25 09:17:55', NULL, '2025-11-25 09:15:46', '2025-11-25 09:17:55'),
(79, 'App\\Models\\User', 12, 'authToken', '7fb86145d14cd1e5a38db88ba806539c7cdc5656a5ab8aa0b353ce208dbd15b6', '[\"*\"]', NULL, NULL, '2025-12-04 01:02:52', '2025-12-04 01:02:52'),
(85, 'App\\Models\\User', 1, 'authToken', '65733c3ac2318025bf49d6196e70b74c528cc3c258126c806970015a10ad30ea', '[\"*\"]', '2025-12-04 02:24:54', NULL, '2025-12-04 02:19:50', '2025-12-04 02:24:54'),
(86, 'App\\Models\\User', 2, 'authToken', 'aed4888338aa8a1ec9205c0a15bae65f201a8d8b5fa5943c68ad0340eb805f95', '[\"*\"]', '2025-12-04 14:29:41', NULL, '2025-12-04 06:51:44', '2025-12-04 14:29:41'),
(87, 'App\\Models\\User', 1, 'authToken', '51f8627034f26ae563b8330fd9555742641e3bcd1c307bbaee36d68b655710d7', '[\"*\"]', '2025-12-04 14:34:39', NULL, '2025-12-04 06:53:09', '2025-12-04 14:34:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_product` varchar(255) NOT NULL,
  `description_product` varchar(255) NOT NULL,
  `image_product` varchar(255) NOT NULL,
  `quantity_product` int(11) NOT NULL,
  `price_product` float NOT NULL,
  `original_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá gốc',
  `discount_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá sau giảm',
  `discount_percent` int(11) DEFAULT 0 COMMENT 'Phần trăm giảm giá',
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `status_product` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0 is enable,1 is disable'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name_product`, `description_product`, `image_product`, `quantity_product`, `price_product`, `original_price`, `discount_price`, `discount_percent`, `category_id`, `status_product`) VALUES
(1, 'Áo Sơ Mi Nam Trắng Oxford', 'Áo sơ mi nam chất liệu cotton cao cấp, thiết kế cổ điển, phù hợp đi làm và dự tiệc', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 148, 350000, 455000.00, 350000.00, 23, 1, 0),
(2, 'Áo Thun Nam Basic Đen', 'Áo thun nam chất liệu cotton 100%, form regular fit thoải mái', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 198, 150000, 195000.00, 150000.00, 23, 1, 0),
(3, 'Áo Polo Nam Xanh Navy', 'Áo polo nam chất liệu pique cotton, thấm hút mồ hôi tốt', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 179, 250000, 325000.00, 250000.00, 23, 1, 0),
(4, 'Áo Kiểu Nữ Hoa Nhí', 'Áo kiểu nữ họa tiết hoa nhí dịu dàng, chất liệu voan mềm mại', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 120, 280000, 364000.00, 280000.00, 23, 2, 0),
(5, 'Áo Sơ Mi Nữ Trắng Công Sở', 'Áo sơ mi nữ thiết kế thanh lịch, phù hợp môi trường văn phòng', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 100, 320000, 416000.00, 320000.00, 23, 2, 0),
(6, 'Áo Croptop Nữ Trắng', 'Áo croptop nữ phong cách trẻ trung, năng động', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 150, 180000, 234000.00, 180000.00, 23, 2, 0),
(7, 'Quần Jeans Nam Xanh Đậm', 'Quần jeans nam dáng slim fit, chất liệu denim co giãn nhẹ', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 128, 450000, 585000.00, 450000.00, 23, 3, 0),
(8, 'Quần Kaki Nam Be', 'Quần kaki nam form regular, chất liệu thoáng mát', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 140, 380000, 494000.00, 380000.00, 23, 3, 0),
(9, 'Quần Âu Nam Đen', 'Quần âu nam công sở, form chuẩn, vải không nhăn', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 110, 420000, 546000.00, 420000.00, 23, 3, 0),
(10, 'Quần Jeans Nữ Rách Gối', 'Quần jeans nữ phong cách cá tính, rách nhẹ ở gối', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 160, 480000, 624000.00, 480000.00, 23, 4, 0),
(11, 'Quần Tây Nữ Đen', 'Quần tây nữ công sở, thiết kế ống suông thanh lịch', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 90, 350000, 455000.00, 350000.00, 23, 4, 0),
(12, 'Quần Short Nữ Vải', 'Quần short nữ dáng suông thoải mái, phù hợp mùa hè', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 170, 220000, 286000.00, 220000.00, 23, 4, 0),
(13, 'Váy Maxi Hoa Dài', 'Váy maxi hoa dạo phố, thiết kế xòe nhẹ nhàng', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 80, 520000, 676000.00, 520000.00, 23, 5, 0),
(14, 'Đầm Công Sở Đen', 'Đầm công sở thiết kế đơn giản, thanh lịch', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 70, 480000, 624000.00, 480000.00, 23, 5, 0),
(15, 'Váy Chữ A Trắng', 'Váy chữ A dáng xòe trẻ trung, phù hợp dạo phố', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 100, 350000, 455000.00, 350000.00, 23, 5, 0),
(16, 'Áo Khoác Jeans Nam', 'Áo khoác jeans nam phong cách năng động', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 85, 650000, 845000.00, 650000.00, 23, 6, 0),
(17, 'Áo Khoác Dạ Nữ', 'Áo khoác dạ nữ ấm áp, thiết kế sang trọng', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 60, 950000, 1235000.00, 950000.00, 23, 6, 0),
(18, 'Áo Gió Nam', 'Áo gió nam chống nước, phù hợp hoạt động ngoài trời', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 94, 450000, 585000.00, 450000.00, 23, 6, 0),
(19, 'Bộ Đồ Thể Thao Nam', 'Bộ đồ thể thao nam chất liệu thấm hút mồ hôi', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 119, 550000, 715000.00, 550000.00, 23, 7, 0),
(20, 'Bộ Đồ Yoga Nữ', 'Bộ đồ yoga nữ co giãn 4 chiều, ôm dáng', 'https://external-preview.redd.it/chelsea-25-26-shirt-sponsor-design-based-on-footy-headlines-v0-hABonyuEKLxqNHFKzRixlZm2O6AQloiyPXgl_AMahDs.jpg?width=640&crop=smart&auto=webp&s=f8496133a7c22b933d8d4e859b8592bba56e1090', 110, 480000, NULL, NULL, 0, 7, 1),
(21, 'GZ Shadow Cap', 'Mũ len phong cách destroyed cá tính với các đường tua thô cố ý, tạo cảm giác bụi và phá cách. Chất len dày form ôm đầu, giữ ấm tốt nhưng vẫn thoáng khí. Logo GZ dệt nổi phía trước tạo điểm nhấn mạnh mẽ. Phù hợp streetwear, mix đồ layer, áo hoodie, jacket.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971248/GZ_Oblivion_Knit_Cap_chllx9.png', 10, 450000, 585000.00, 450000.00, 23, 9, 0),
(22, 'GZ Street Torn', 'Mũ lưỡi trai đen với điểm rách nhẹ tinh tế, logo GZ thêu 3D nổi bật. Form cứng cáp, dễ phối mọi outfit từ casual tới streetstyle. Đai khóa sau điều chỉnh linh hoạt, đội ôm đầu, không bí.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971244/GZ_Oblivion_Echo_Cap_c21ybf.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(23, 'GZ Blackout Edition', 'Thiết kế tối giản, mạnh mẽ với các chi tiết scratch rải nhẹ. Logo GZ dạng kim loại mảnh tạo phong cách “đô thị tối giản” hiện đại. Phù hợp nam nữ, thích hợp đi chơi – đi phố – chụp hình.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971243/GZ_Shadow_Brim_Cap_a4bc3x.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(24, 'GZ Urban Destroyed', 'Điểm nhấn là logo GZ kim loại dạng mảng lớn, đi cùng đường chỉ “bung chỉ giả\" mang vibe street phá cách. Chất liệu mềm – uốn form đẹp – rách nghệ thuật tạo cá tính riêng.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971243/GZ_Oblivion_Stitch_Cap_aexrzv.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(25, 'GZ Tactical Titan Pack', 'Balo tactical dung tích lớn, thiết kế đa ngăn kiểu quân đội. Chất liệu vải dày chống sờn, dây đai chắc – khóa kim loại bền. Vibe cực mạnh cho người thích du lịch, phượt, công việc outdoor. Logo GZ gắn trước nổi bật.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971248/GZ_System_Overload_Utility_Pack_j0lxh7.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(26, 'GZ Rebel Cap', 'Mũ tone đen với phần rách sâu và logo GZ kim loại tone xám khói. Tạo phong cách underground mạnh, hợp với áo phông tối màu, áo khoác denim hoặc bomber.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971242/GZ_Ruin_Decon_Cap_vaeui2.png', 10, 580000, 754000.00, 580000.00, 23, 9, 0),
(27, 'GZ Streetcore', 'Mũ phong cách tactical nhẹ, các chi tiết rách nhẹ và cắt lớp mang vibe lính – đường phố. Logo GZ mini tinh tế. Form cứng chắc, phù hợp hoạt động ngoài trời, du lịch, chụp hình phong cách “darkwear”.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971240/GZ_Oblivion_Distressed_Ball_Cap_cd5itv.png', 10, 650000, 845000.00, 650000.00, 23, 9, 0),
(28, 'GZ Nightstorm', 'Form mũ tactical đen với nhiều chi tiết cắt chỉ và điểm rách đối xứng. Lưỡi trai cong vừa phải, đội thoải mái cả ngày. Giữ được vibe phủi bụi, nam tính, mạnh mẽ.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/GZ_Oblivion_Distressed_Cap_vsqt3u.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(29, 'GZ Desert Ranger Pack', 'Balo phong cách lính desert, tone nâu vintage cực ngầu. Chất liệu canvas dày, nhiều ngăn phụ, dây kéo chắc chắn. Thích hợp trekking, đi phố, chụp hình phong cách thợ săn – retro – outdoor.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971247/GZ_System_Tech_Pack_p36rs3.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(30, 'GZ Black Ops Pack', 'Tone đen full, khí chất mạnh mẽ như đồ lính đặc nhiệm. Form vuông – dây đai – khóa kim loại tạo độ “đầm”. Khoang chứa rộng, chịu tải tốt, bền bỉ cho cả công việc lẫn du lịch.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971246/GZ_Payload_Hauler_Pack_osodpf.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(31, 'GZ Recon X-Series', 'Balo 3 tầng với hệ dây chéo X đặc trưng. Tạo điểm nhấn mạnh – khác biệt – đậm chất tactical. Màu rêu quân đội, ngăn trong rộng, chịu ma sát tốt. Phù hợp dân đi tour, đi rừng, phượt thủ.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971246/GZ_Ruin_Haul_Pack_tpcilb.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(32, 'GZ Wilderness Cargo', 'Phiên bản nâu vintage với nhiều ngăn hộp kiểu cargo. Cảm giác “thám hiểm – dã ngoại”. Vải canvas dày, dây đai lớn, khóa bền. Thiết kế phù hợp du lịch, studio, outdoor.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971245/GZ_Ravage_Cargo_Pack_vch4ei.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(33, 'GZ Urban Mini Sling (Yellow)', 'Túi đeo chéo mini màu vàng trẻ trung, hiện đại. Form vuông bo cạnh mềm mại, logo GZ đúc nổi ấn tượng. Nhỏ gọn nhưng đủ chứa đồ cá nhân. Hợp phối outfit streetwear – casual – daily.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/download_11_zzicvw.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(34, 'GZ Compact Sidebag (Coral)', 'Túi màu cam đất độc lạ, thiết kế tối giản – điểm nhấn logo GZ kim loại trước. Dây đeo mềm, điều chỉnh dễ. Phù hợp đi chơi, dạo phố, café.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971231/download_12_rw5lgx.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(35, 'GZ Field Utility Sling (Black)', 'Túi chéo tactical đen với form hộp vuông, nhiều ngăn nhỏ. Thân túi chống sờn, dây đai chắc chắn, phù hợp người thích phong cách lính – outdoor – utilitarian.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971230/download_3_wnqc6o.png', 10, 480000, 624000.00, 480000.00, 23, 9, 0),
(36, 'GZ Core Hoodie (Black)', 'Hoodie đen form rộng, logo GZ trắng trước ngực. Chất nỉ dày mềm, ấm và thoải mái. Mặc đi học – đi làm – đi chơi đều hợp, mix được mọi phong cách.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_2_njpyho.png', 90, 350000, 455000.00, 350000.00, 23, 6, 0),
(37, 'GZ Round Flare Skirt', 'Váy xoè rộng bo tròn, chuyển động đẹp khi đi lại. Mang vibe nữ tính – hiện đại. Phối được casual lẫn cá tính.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_10_xoyasx.png', 110, 480000, 624000.00, 480000.00, 23, 5, 0),
(38, 'GZ Flow Motion Skirt (Black)', 'Váy xoè mỏng nhẹ hơn, độ xoè mềm tạo kiểu “bay gió” rất đẹp khi chụp ảnh. Dễ mix cùng áo đen – xám – croptop.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/download_7_ujsgbj.png', 110, 480000, 624000.00, 480000.00, 23, 5, 0),
(39, 'GZ Desert Canvas Mini Skirt', 'Váy canvas màu nâu military, có dây rút – chi tiết rách nhẹ kiểu tactical. Mang phong cách độc lạ, phù hợp nữ cá tính yêu streetwear.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/dsc03116_large_5a43f0478dc74eb49b48b090be289ae6_wmyhcc.jpg', 110, 480000, 624000.00, 480000.00, 23, 5, 0),
(40, 'GZ Indigo Wide-Leg Denim Skirt-Pants', 'Thiết kế dạng quần ống rộng nhưng mô phỏng chân váy, màu denim indigo đậm. Form rộng cực thoải mái, phong cách Nhật – streetwear – unisex.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971228/150925.hades3151_large_489341173b344d3db9cd03fb3968685a_f5d1s8.jpg', 110, 480000, 624000.00, 480000.00, 23, 3, 0),
(41, 'GZ Nebula Runner – Purple/Orange', 'Sneaker chạy bộ – training với phối màu tím cam nổi bật như “nebula”. Đế cao su đệm dày êm chân, phần upper thoáng khí, form thể thao trẻ trung. Hợp mang đi tập – đi phố – đi học.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/download_14_wnzkv3.png', 10, 480000, 624000.00, 480000.00, 23, 10, 0),
(42, 'GZ Black Tactical High-Top', 'Giày high-top đen full, vibe tactical mạnh mẽ. Upper da tổng hợp + đế bản lớn chắc chắn, cổ cao ôm cổ chân. Logo GZ đặt trước tăng điểm nhận diện. Phối đẹp với cargo – jogger.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/download_4_gvfknn.png', 10, 480000, 624000.00, 480000.00, 23, 10, 0),
(43, 'GZ Classic Stiletto Heels (Black)', 'Giày cao gót mũi nhọn bóng sang trọng, form elegant. Gót cao thanh, ôm chân, phù hợp tiệc – công sở – event. Kiểu dáng basic timeless, dễ phối váy hoặc quần.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/c_fill,ar_4:3/v1763971235/download_9_i028ix.png', 10, 480000, 624000.00, 480000.00, 23, 10, 0),
(44, 'GZ Aurora Runner – Pink/White', 'Sneaker chunky phối hồng pastel – trắng, đế cao, dáng trẻ trung. Form ôm chân, đệm êm, đi lâu thoải mái. Style nữ tính nhưng cá tính, hợp phối đồ streetwear lẫn casual.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971234/download_15_wpkcjo.png', 10, 480000, 624000.00, 480000.00, 23, 10, 0),
(45, 'GZ Metallic Strap High Heels (Silver)', 'Cao gót dây kim loại ánh bạc, thiết kế thời trang – hiện đại. Chất liệu bóng nổi bật dưới ánh đèn. Hợp đi tiệc, event, photo shoot thời trang.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971233/download_13_ysxtmu.png', 10, 480000, 624000.00, 480000.00, 23, 10, 0),
(46, 'GZ Pure White Minimal Sneakers', 'Sneaker trắng tối giản, form trơn cực clean. Chất liệu mềm, đế cao su dẻo chống trượt. Mang vibe “minimal luxury”, dễ phối mọi outfit từ đồ công sở đến streetwear.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971232/download_6_u2u5mt.png', 10, 480000, 624000.00, 480000.00, 23, 10, 0),
(47, 'GZ Shadow White Leather Sneakers', 'Giày sneaker da trắng, đường nét mảnh – tinh tế. Đế liền form, nhẹ chân, phù hợp đi làm – đi học – đi chơi. Tone trắng sang, phù hợp cả nam & nữ.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971229/download_3_sgti8m.png', 10, 480000, 624000.00, 480000.00, 23, 10, 0),
(48, 'GZ Street Warrior High-Top (Black/Red/White)', 'Giày high-top chiến binh với phối màu đen – đỏ – trắng cực ngầu. Dây đai khóa bản lớn tạo vibe combat. Đế cao su bám đường, form mạnh – hợp style hiphop/street.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971231/download_1_sluv5r.png', 10, 480000, 624000.00, 480000.00, 23, 10, 0),
(49, 'GZ Casual Karambit Heels (Black)', 'Giày cao gót mũi nhọn bóng sang trọng, form elegant. Gót cao thanh, ôm chân, phù hợp tiệc – công sở – event. Kiểu dáng basic timeless, dễ phối váy hoặc quần.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/c_crop,ar_4:3/v1763971229/download_2_ljdoip.png', 10, 480000, 624000.00, 480000.00, 23, 10, 0),
(50, 'GZ Washed Tactical Denim Set', 'Bộ denim wash loang phong cách tactical với form rộng cá tính. Áo khoác denim túi hộp lớn, đường wash bạc mạnh tạo hiệu ứng bụi – retro. Quần cargo denim đi kèm túi hộp, dây kéo và chi tiết viền chỉ nổi.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971237/GZ_Abyss_Wash_Cargo_Denim_fn1aaf.png', 10, 480000, 624000.00, 480000.00, 23, 1, 0),
(51, 'GZ Casual Karambit Heels (Black)', 'Tracksuit vải nhung cao cấp, bề mặt bóng mờ sang trọng. Áo khoác zip form rộng – cổ cao – đường chỉ nổi tinh tế.', 'https://res.cloudinary.com/dkpnat2ht/image/upload/v1763971235/GZ_Midnight_Velocity_Jacket_gwrla8.png', 4, 499200, 624000.00, 499200.00, 20, 1, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_attributes`
--

CREATE TABLE `product_attributes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `attribute_option_id` bigint(20) UNSIGNED DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL COMMENT 'Size sản phẩm (S, M, L, XL, 38, 39, 40, etc.)',
  `color` varchar(50) DEFAULT NULL COMMENT 'Màu sắc',
  `quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng tồn kho cho size/color này',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_attributes`
--

INSERT INTO `product_attributes` (`id`, `product_id`, `attribute_option_id`, `size`, `color`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'S', NULL, 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(2, 1, NULL, 'M', NULL, 29, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(3, 1, NULL, 'L', NULL, 29, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(4, 1, NULL, 'XL', NULL, 29, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(5, 1, NULL, 'XXL', NULL, 29, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(6, 2, NULL, 'S', NULL, 42, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(7, 2, NULL, 'M', NULL, 39, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(8, 2, NULL, 'L', NULL, 39, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(9, 2, NULL, 'XL', NULL, 39, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(10, 2, NULL, 'XXL', NULL, 39, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(11, 3, NULL, 'S', NULL, 39, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(12, 3, NULL, 'M', NULL, 35, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(13, 3, NULL, 'L', NULL, 35, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(14, 3, NULL, 'XL', NULL, 35, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(15, 3, NULL, 'XXL', NULL, 35, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(16, 4, NULL, 'S', NULL, 24, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(17, 4, NULL, 'M', NULL, 24, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(18, 4, NULL, 'L', NULL, 24, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(19, 4, NULL, 'XL', NULL, 24, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(20, 4, NULL, 'XXL', NULL, 24, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(21, 5, NULL, 'S', NULL, 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(22, 5, NULL, 'M', NULL, 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(23, 5, NULL, 'L', NULL, 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(24, 5, NULL, 'XL', NULL, 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(25, 5, NULL, 'XXL', NULL, 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(26, 6, NULL, 'S', NULL, 30, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(27, 6, NULL, 'M', NULL, 30, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(28, 6, NULL, 'L', NULL, 30, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(29, 6, NULL, 'XL', NULL, 30, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(30, 6, NULL, 'XXL', NULL, 30, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(31, 7, NULL, 'S', NULL, 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(32, 7, NULL, 'M', NULL, 25, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(33, 7, NULL, 'L', NULL, 25, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(34, 7, NULL, 'XL', NULL, 25, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(35, 7, NULL, 'XXL', NULL, 25, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(36, 8, NULL, 'S', NULL, 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(37, 8, NULL, 'M', NULL, 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(38, 8, NULL, 'L', NULL, 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(39, 8, NULL, 'XL', NULL, 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(40, 8, NULL, 'XXL', NULL, 28, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(41, 9, NULL, 'S', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(42, 9, NULL, 'M', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(43, 9, NULL, 'L', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(44, 9, NULL, 'XL', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(45, 9, NULL, 'XXL', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(46, 10, NULL, 'S', NULL, 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(47, 10, NULL, 'M', NULL, 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(48, 10, NULL, 'L', NULL, 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(49, 10, NULL, 'XL', NULL, 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(50, 10, NULL, 'XXL', NULL, 32, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(51, 11, NULL, 'S', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(52, 11, NULL, 'M', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(53, 11, NULL, 'L', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(54, 11, NULL, 'XL', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(55, 11, NULL, 'XXL', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(56, 12, NULL, 'S', NULL, 34, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(57, 12, NULL, 'M', NULL, 34, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(58, 12, NULL, 'L', NULL, 34, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(59, 12, NULL, 'XL', NULL, 34, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(60, 12, NULL, 'XXL', NULL, 34, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(61, 13, NULL, 'S', NULL, 16, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(62, 13, NULL, 'M', NULL, 16, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(63, 13, NULL, 'L', NULL, 16, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(64, 13, NULL, 'XL', NULL, 16, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(65, 13, NULL, 'XXL', NULL, 16, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(66, 14, NULL, 'S', NULL, 14, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(67, 14, NULL, 'M', NULL, 14, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(68, 14, NULL, 'L', NULL, 14, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(69, 14, NULL, 'XL', NULL, 14, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(70, 14, NULL, 'XXL', NULL, 14, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(71, 15, NULL, 'S', NULL, 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(72, 15, NULL, 'M', NULL, 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(73, 15, NULL, 'L', NULL, 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(74, 15, NULL, 'XL', NULL, 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(75, 15, NULL, 'XXL', NULL, 20, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(76, 16, NULL, 'S', NULL, 17, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(77, 16, NULL, 'M', NULL, 17, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(78, 16, NULL, 'L', NULL, 17, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(79, 16, NULL, 'XL', NULL, 17, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(80, 16, NULL, 'XXL', NULL, 17, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(81, 17, NULL, 'S', NULL, 12, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(82, 17, NULL, 'M', NULL, 12, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(83, 17, NULL, 'L', NULL, 12, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(84, 17, NULL, 'XL', NULL, 12, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(85, 17, NULL, 'XXL', NULL, 12, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(86, 18, NULL, 'S', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(87, 18, NULL, 'M', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(88, 18, NULL, 'L', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(89, 18, NULL, 'XL', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(90, 18, NULL, 'XXL', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(91, 19, NULL, 'S', NULL, 27, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(92, 19, NULL, 'M', NULL, 23, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(93, 19, NULL, 'L', NULL, 23, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(94, 19, NULL, 'XL', NULL, 23, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(95, 19, NULL, 'XXL', NULL, 23, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(96, 21, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(97, 21, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(98, 21, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(99, 21, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(100, 21, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(101, 22, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(102, 22, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(103, 22, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(104, 22, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(105, 22, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(106, 23, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(107, 23, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(108, 23, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(109, 23, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(110, 23, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(111, 24, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(112, 24, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(113, 24, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(114, 24, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(115, 24, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(116, 25, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(117, 25, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(118, 25, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(119, 25, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(120, 25, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(121, 26, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(122, 26, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(123, 26, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(124, 26, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(125, 26, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(126, 27, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(127, 27, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(128, 27, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(129, 27, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(130, 27, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(131, 28, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(132, 28, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(133, 28, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(134, 28, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(135, 28, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(136, 29, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(137, 29, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(138, 29, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(139, 29, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(140, 29, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(141, 30, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(142, 30, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(143, 30, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(144, 30, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(145, 30, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(146, 31, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(147, 31, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(148, 31, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(149, 31, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(150, 31, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(151, 32, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(152, 32, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(153, 32, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(154, 32, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(155, 32, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(156, 33, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(157, 33, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(158, 33, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(159, 33, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(160, 33, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(161, 34, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(162, 34, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(163, 34, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(164, 34, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(165, 34, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(166, 35, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(167, 35, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(168, 35, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(169, 35, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(170, 35, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(171, 36, NULL, 'S', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(172, 36, NULL, 'M', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(173, 36, NULL, 'L', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(174, 36, NULL, 'XL', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(175, 36, NULL, 'XXL', NULL, 18, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(176, 37, NULL, 'S', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(177, 37, NULL, 'M', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(178, 37, NULL, 'L', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(179, 37, NULL, 'XL', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(180, 37, NULL, 'XXL', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(181, 38, NULL, 'S', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(182, 38, NULL, 'M', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(183, 38, NULL, 'L', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(184, 38, NULL, 'XL', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(185, 38, NULL, 'XXL', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(186, 39, NULL, 'S', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(187, 39, NULL, 'M', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(188, 39, NULL, 'L', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(189, 39, NULL, 'XL', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(190, 39, NULL, 'XXL', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(191, 40, NULL, 'S', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(192, 40, NULL, 'M', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(193, 40, NULL, 'L', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(194, 40, NULL, 'XL', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(195, 40, NULL, 'XXL', NULL, 22, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(196, 41, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(197, 41, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(198, 41, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(199, 41, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(200, 41, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(201, 42, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(202, 42, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(203, 42, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(204, 42, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(205, 42, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(206, 43, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(207, 43, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(208, 43, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(209, 43, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(210, 43, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(211, 44, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(212, 44, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(213, 44, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(214, 44, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(215, 44, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(216, 45, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(217, 45, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(218, 45, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(219, 45, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(220, 45, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(221, 46, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(222, 46, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(223, 46, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(224, 46, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(225, 46, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(226, 47, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(227, 47, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(228, 47, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(229, 47, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(230, 47, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(231, 48, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(232, 48, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(233, 48, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(234, 48, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(235, 48, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(236, 49, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(237, 49, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(238, 49, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(239, 49, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(240, 49, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(241, 50, NULL, 'S', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(242, 50, NULL, 'M', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(243, 50, NULL, 'L', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(244, 50, NULL, 'XL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(245, 50, NULL, 'XXL', NULL, 2, '2025-12-04 00:16:44', '2025-12-04 00:16:44'),
(258, 51, NULL, 'L', NULL, 0, '2025-12-04 01:58:39', '2025-12-04 01:58:39'),
(259, 51, NULL, 'M', NULL, 0, '2025-12-04 01:58:39', '2025-12-04 01:58:39'),
(260, 51, NULL, 'S', NULL, 2, '2025-12-04 01:58:39', '2025-12-04 01:58:39'),
(261, 51, NULL, 'XL', NULL, 2, '2025-12-04 01:58:39', '2025-12-04 01:58:39'),
(262, 51, NULL, 'XXL', NULL, 3, '2025-12-04 01:58:39', '2025-12-04 01:58:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `content` text DEFAULT NULL,
  `admin_reply` text DEFAULT NULL COMMENT 'Phản hồi từ admin',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0: Ẩn, 1: Hiển thị',
  `admin_replied_at` timestamp NULL DEFAULT NULL COMMENT 'Thời gian admin phản hồi',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `rating`, `content`, `admin_reply`, `status`, `admin_replied_at`, `created_at`, `updated_at`) VALUES
(5, 2, 51, 5, 'Sản phẩm tốt', NULL, 1, NULL, '2025-12-04 07:03:37', '2025-12-04 07:03:37');

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

--
-- Đang đổ dữ liệu cho bảng `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('X7b8l06pH4YocJ0XJuzkR4jpr4tilrD8kCjM7pF2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzJyQ1lYSzhZV2pLNXlrclFaTk96YVhPV0I2NGhjYkRNeDR0TGxyYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9jYXRlZ29yaWVzL2FvLW5hbS5qcGciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1764858591);

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
(11, 'Nguyễn Văn A', 'nguyenvanc@gmail.com', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, '416/BB ấp Bờ Bàu, xã Mỹ Chánh, huyện Ba Tri, tỉnh Bến Tre', '0990123457', 0, NULL, '2025-11-18 23:15:27', '2025-11-18 23:38:08');

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
(2, 'GIAM50K', 'Giảm 50.000₫ cho đơn hàng từ 300.000₫', 'Giảm trực tiếp 50.000₫ cho đơn hàng', 'fixed', 50000.00, 300000.00, NULL, 200, 2, '2025-11-29 07:18:38', '2025-12-24 07:18:38', 1, '2025-12-04 00:18:38', '2025-12-04 00:18:38'),
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
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `attribute_options`
--
ALTER TABLE `attribute_options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `attribute_options_type_value_unique` (`type`,`value`);

--
-- Chỉ mục cho bảng `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `banners_position_status_order_index` (`position`,`status`,`order`);

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

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
-- Chỉ mục cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Chỉ mục cho bảng `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Chỉ mục cho bảng `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

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
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

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
  ADD KEY `product_attributes_product_id_size_color_index` (`product_id`,`size`,`color`),
  ADD KEY `product_attributes_attribute_option_id_foreign` (`attribute_option_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reviews_user` (`user_id`),
  ADD KEY `idx_reviews_product` (`product_id`),
  ADD KEY `idx_reviews_rating` (`rating`);

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
-- AUTO_INCREMENT cho bảng `attribute_options`
--
ALTER TABLE `attribute_options`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT cho bảng `categories_product`
--
ALTER TABLE `categories_product`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `password_reset_otps`
--
ALTER TABLE `password_reset_otps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT cho bảng `product_attributes`
--
ALTER TABLE `product_attributes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=278;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `product_attributes_attribute_option_id_foreign` FOREIGN KEY (`attribute_option_id`) REFERENCES `attribute_options` (`id`) ON DELETE CASCADE,
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
