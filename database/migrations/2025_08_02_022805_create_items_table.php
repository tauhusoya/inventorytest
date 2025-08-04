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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->unique(); // Manual ID
            $table->string('name');
            $table->text('description');
            $table->enum('brand', ['PiRGE', 'Jaya Mata', 'Atasan Bicak']);
            $table->string('model');
            $table->decimal('cost', 10, 2);
            $table->decimal('retail', 10, 2);
            $table->integer('quantity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
