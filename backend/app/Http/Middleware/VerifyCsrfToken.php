<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*',       // Quan trọng: Tắt CSRF cho mọi route bắt đầu bằng api/
        '/search-order', // Route tìm kiếm đơn hàng public (nếu dùng POST)
        '/chat',       // Route chatbot
        '/cart/*',     // Nếu giỏ hàng gọi AJAX
    ];
}
