@extends('app')

@section('content')
<div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">User Details</h1>
            <a href="{{ route('users.index') }}" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                Back to Users
            </a>
        </div>
        <div class="bg-white shadow-lg rounded-lg p-6">
            <dl class="divide-y divide-gray-200">
                <div class="py-4 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">First Name</dt>
                    <dd class="text-sm text-gray-900">{{ $user->first_name }}</dd>
                </div>
                <div class="py-4 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Last Name</dt>
                    <dd class="text-sm text-gray-900">{{ $user->last_name }}</dd>
                </div>
                <div class="py-4 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                    <dd class="text-sm text-gray-900">{{ $user->email }}</dd>
                </div>
                <div class="py-4 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Role</dt>
                    <dd class="text-sm text-gray-900">{{ $user->role }}</dd>
                </div>
                <div class="py-4 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Status</dt>
                    <dd class="text-sm text-gray-900">{{ $user->status }}</dd>
                </div>
                <div class="py-4 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Last Login At</dt>
                    <dd class="text-sm text-gray-900">{{ $user->last_login_at ? $user->last_login_at->format('M d, Y H:i') : '-' }}</dd>
                </div>
                <div class="py-4 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Created At</dt>
                    <dd class="text-sm text-gray-900">{{ $user->created_at->format('M d, Y H:i') }}</dd>
                </div>
                <div class="py-4 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500">Updated At</dt>
                    <dd class="text-sm text-gray-900">{{ $user->updated_at->format('M d, Y H:i') }}</dd>
                </div>
            </dl>
        </div>
    </div>
</div>
@endsection