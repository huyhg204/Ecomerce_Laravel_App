@extends('admin.layout')

@section('title', 'Danh sách Người dùng')
@section('page-title', 'Danh sách Người dùng')

@section('content')
    <div class="table-responsive">
        <table class="table table-striped">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Số đơn hàng đã mua</th>
                    <th>Số tiền chi tiêu</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($users as $index => $user)
                
                @endforeach
                <tr>
                    <td>{{++$index}}</td>
                    <td>{{$user->name}}</td>
                    <td>{{$user->email}}</td>
                    <td>{{$user->phone}}</td>
                    <td>{{$user->total_orders}}</td>
                    <td>{{number_format($user->total_spent, 0, ',', '.') . ' ₫'}}</td>
                    <td>
                        @if ($user->status_user==0)
                        <span class="badge bg-success">Hoạt động</span>
                        @else
                        <span class="badge bg-danger">Bị khóa</span>
                        @endif
                    </td>
                    <td>
                        @if ($user->status_user==0)
                        <a href="{{ route('admin.user.destroy', ['id' => $user->id]) }}" class="btn btn-sm btn-danger">Khóa</a>
                        @else
                        <a href="{{ route('admin.user.restore', ['id' => $user->id]) }}" class="btn btn-sm btn-success">Mở</a>
                        @endif
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
@endsection
