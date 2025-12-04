<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

abstract class Controller
{
    public $CategoriesHeader;

    public function __construct() {

        $this->CategoriesHeader = DB::table('categories_product')
            ->where('status_category', 0)
            ->get();
    }
}
