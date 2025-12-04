<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Quan trọng: Import thư viện Token

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // Quan trọng: Sử dụng Trait

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',        // Thêm các trường này vào để API Register hoạt động
        'address',
        'role_user',
        'status_user'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
