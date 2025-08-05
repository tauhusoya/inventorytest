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
        Schema::table('users', function (Blueprint $table) {
            // First, drop the primary key constraint
            $table->dropPrimary();
        });

        Schema::table('users', function (Blueprint $table) {
            // Drop the existing id column
            $table->dropColumn('id');
        });

        Schema::table('users', function (Blueprint $table) {
            // Recreate the id column with auto-increment
            $table->id()->first();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the primary key constraint
            $table->dropPrimary();
        });

        Schema::table('users', function (Blueprint $table) {
            // Drop the auto-increment id column
            $table->dropColumn('id');
        });

        Schema::table('users', function (Blueprint $table) {
            // Recreate the original id column
            $table->unsignedBigInteger('id')->first();
            $table->primary('id');
        });
    }
};
