#!/bin/bash

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install Node.js dependencies and build assets
npm install
npm run build

# Create storage directories
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Laravel setup
php artisan key:generate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache 