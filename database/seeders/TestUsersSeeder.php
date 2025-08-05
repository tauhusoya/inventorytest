<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class TestUsersSeeder extends Seeder
{
    public function run()
    {
        // Admin user
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'), // Change as needed
                'role' => 'Admin',
                'status' => 'Active',
            ]
        );

        // Staff user
        User::updateOrCreate(
            ['email' => 'staff@example.com'],
            [
                'first_name' => 'Staff',
                'last_name' => 'User',
                'email' => 'staff@example.com',
                'password' => Hash::make('password'), // Change as needed
                'role' => 'Staff',
                'status' => 'Active',
            ]
        );
    }
}