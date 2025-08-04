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
        Schema::table('stock_transactions', function (Blueprint $table) {
            $table->string('batch_id')->nullable()->after('quantity');
            $table->integer('remaining_quantity')->default(0)->after('batch_id');
            $table->boolean('is_old_stock')->default(false)->after('remaining_quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_transactions', function (Blueprint $table) {
            $table->dropColumn(['batch_id', 'remaining_quantity', 'is_old_stock']);
        });
    }
};
