#!/bin/bash

set -e

echo "Starting deployment..."

# Install PHP dependencies
echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

# Install Node.js dependencies and build assets
echo "Installing Node.js dependencies and building assets..."
npm install
npm run build

# Create storage directories if they don't exist
echo "Setting up storage directories..."
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Laravel setup
echo "Running Laravel setup..."
php artisan key:generate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting Laravel application..."
php artisan serve --host=0.0.0.0 --port=$PORT 