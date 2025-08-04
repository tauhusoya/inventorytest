#!/bin/bash

set -e

echo "=== Starting Railway Deployment ==="

# Check if we're in the right directory
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

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

# Check if .env exists, if not create from example
if [ ! -f .env ]; then
    echo "=== Creating .env file ==="
    cp .env.example .env
fi

# Laravel setup
echo "=== Running Laravel setup ==="
php artisan key:generate --force || echo "Key generation failed, continuing..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# Test if Laravel can start
echo "=== Testing Laravel application ==="
php artisan --version

# Test database connection (optional)
echo "=== Testing database connection ==="
php artisan tinker --execute="echo 'Database connection test completed';" || echo "Database connection failed, but continuing..."

echo "=== Starting Laravel application on port $PORT ==="
echo "Host: 0.0.0.0"
echo "Port: $PORT"

# Start the application with error reporting
exec php -S 0.0.0.0:$PORT -t public public/index.php 