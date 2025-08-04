#!/bin/bash

set -e

echo "=== Starting Laravel Build Process ==="

# Install PHP dependencies
echo "=== Installing PHP dependencies ==="
composer install --no-dev --optimize-autoloader

# Install Node.js dependencies and build assets
echo "=== Installing Node.js dependencies and building assets ==="
npm install
npm run build

# Create storage directories if they don't exist
echo "=== Setting up storage directories ==="
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Set permissions
echo "=== Setting permissions ==="
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "=== Creating .env file ==="
    cp .env.example .env 2>/dev/null || echo "APP_KEY=" > .env
fi

# Generate application key if not set
echo "=== Generating application key ==="
php artisan key:generate --force || echo "Key generation completed"

# Laravel setup
echo "=== Running Laravel setup ==="
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo "=== Build process completed ===" 