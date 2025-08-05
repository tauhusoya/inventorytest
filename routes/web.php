<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PasswordResetRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Health check route for monitoring
Route::get('/health', function () {
    try {
        // Check database connection
        \DB::connection()->getPdo();
        
        return response()->json([
            'status' => 'ok',
            'timestamp' => now(),
            'version' => '1.0.0',
            'environment' => config('app.env'),
            'database' => 'connected'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'timestamp' => now(),
            'error' => 'Database connection failed'
        ], 500);
    }
});

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    // Check if user is authenticated
    if (auth()->check()) {
        // User is logged in, redirect to dashboard
        return redirect()->route('dashboard');
    } else {
        // User is not logged in, redirect to login
        return redirect()->route('login');
    }
});

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('users', UserManagementController::class);
Route::post('/users/{user}/reactivate', [UserManagementController::class, 'reactivate'])->name('users.reactivate');
Route::delete('/users/{user}/permanently-delete', [UserManagementController::class, 'permanentlyDelete'])->name('users.permanently-delete');
Route::post('/reactivation-requests/{request}/approve', [UserManagementController::class, 'approveReactivation'])->name('reactivation.approve');
Route::post('/reactivation-requests/{request}/reject', [UserManagementController::class, 'rejectReactivation'])->name('reactivation.reject');

// Password Reset Requests
Route::get('/password-reset-requests', [PasswordResetRequestController::class, 'index'])->name('password-reset-requests.index');
Route::post('/password-reset-requests/{reactivationRequest}/approve', [PasswordResetRequestController::class, 'approve'])->name('password-reset-requests.approve');
Route::delete('/password-reset-requests/{reactivationRequest}/delete', [PasswordResetRequestController::class, 'delete'])->name('password-reset-requests.delete');

// Stock routes - must come before items resource routes
Route::middleware('auth')->group(function () {
    Route::get('/stock', [StockController::class, 'index'])->name('stock.index');
    Route::post('/stock/in', [StockController::class, 'stockIn'])->name('stock.in');
    Route::post('/stock/out', [StockController::class, 'stockOut'])->name('stock.out');
    Route::get('/stock/items', [StockController::class, 'getItems'])->name('stock.items');
    Route::get('/stock/calculator-items', [StockController::class, 'getCalculatorItems'])->name('stock.calculator-items');
    Route::get('/stock/calculate', [StockController::class, 'calculate'])->name('stock.calculate');
    Route::get('/stock/aging', [StockController::class, 'getStockAging'])->name('stock.aging');
    Route::get('/stock/low-stock', [StockController::class, 'getLowStock'])->name('stock.low-stock');
    Route::get('/stock/out-of-stock', [StockController::class, 'getOutOfStock'])->name('stock.out-of-stock');
});

Route::get('/items/import', [ItemController::class, 'import'])->name('items.import');
Route::post('/items/import', [ItemController::class, 'processImport'])->name('items.processImport');
Route::get('/items/export', [ItemController::class, 'export'])->name('items.export');
Route::get('/items/debug', [ItemController::class, 'debug'])->name('items.debug');
Route::resource('items', ItemController::class);

require __DIR__.'/auth.php';
