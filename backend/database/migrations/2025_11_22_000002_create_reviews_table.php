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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned(); // 1-5 sao
            $table->text('content')->nullable(); // Nội dung đánh giá
            $table->timestamps();
            
            // Đảm bảo mỗi user chỉ có thể đánh giá 1 sản phẩm 1 lần
            $table->unique(['user_id', 'product_id'], 'unique_user_product_review');
        });

        // Thêm indexes để tối ưu truy vấn
        Schema::table('reviews', function (Blueprint $table) {
            $table->index('user_id', 'idx_reviews_user');
            $table->index('product_id', 'idx_reviews_product');
            $table->index('rating', 'idx_reviews_rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

