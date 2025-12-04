<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Indexes cho bảng products
        Schema::table('products', function (Blueprint $table) {
            $table->index('status_product', 'idx_products_status');
            $table->index('category_id', 'idx_products_category');
            $table->index(['status_product', 'category_id'], 'idx_products_status_category');
        });

        // Indexes cho bảng categories_product
        Schema::table('categories_product', function (Blueprint $table) {
            $table->index('status_category', 'idx_categories_status');
        });

        // Indexes cho bảng orders
        Schema::table('orders', function (Blueprint $table) {
            $table->index('user_id', 'idx_orders_user');
            $table->index('status_order', 'idx_orders_status');
            $table->index('status_delivery', 'idx_orders_delivery');
            $table->index('status_user_order', 'idx_orders_user_status');
            $table->index(['status_order', 'status_delivery'], 'idx_orders_status_delivery');
        });

        // Indexes cho bảng order_details
        Schema::table('order_details', function (Blueprint $table) {
            $table->index('order_id', 'idx_order_details_order');
            $table->index('product_id', 'idx_order_details_product');
            $table->index(['order_id', 'product_id'], 'idx_order_details_order_product');
        });

        // Indexes cho bảng carts
        Schema::table('carts', function (Blueprint $table) {
            $table->index('user_id', 'idx_carts_user');
            $table->index('product_id', 'idx_carts_product');
            $table->index(['user_id', 'product_id'], 'idx_carts_user_product');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Xóa indexes cho bảng products
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_status');
            $table->dropIndex('idx_products_category');
            $table->dropIndex('idx_products_status_category');
        });

        // Xóa indexes cho bảng categories_product
        Schema::table('categories_product', function (Blueprint $table) {
            $table->dropIndex('idx_categories_status');
        });

        // Xóa indexes cho bảng orders
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_user');
            $table->dropIndex('idx_orders_status');
            $table->dropIndex('idx_orders_delivery');
            $table->dropIndex('idx_orders_user_status');
            $table->dropIndex('idx_orders_status_delivery');
        });

        // Xóa indexes cho bảng order_details
        Schema::table('order_details', function (Blueprint $table) {
            $table->dropIndex('idx_order_details_order');
            $table->dropIndex('idx_order_details_product');
            $table->dropIndex('idx_order_details_order_product');
        });

        // Xóa indexes cho bảng carts
        Schema::table('carts', function (Blueprint $table) {
            $table->dropIndex('idx_carts_user');
            $table->dropIndex('idx_carts_product');
            $table->dropIndex('idx_carts_user_product');
        });
    }
};
