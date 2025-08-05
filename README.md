# Inventory Management System

A modern inventory management system built with Laravel 10, React, and Inertia.js.

## Features

- 📦 **Item Management**: Add, edit, and manage inventory items
- 📊 **Stock Tracking**: Real-time stock levels and transactions
- 👥 **User Management**: Multi-user system with role-based access
- 📈 **Stock Aging**: Track item aging and expiration
- 🔄 **Stock Operations**: Stock in/out with batch tracking
- 📋 **Reports**: Export data and generate reports
- 🔐 **Authentication**: Secure login and password management

## Installation

### Prerequisites

- PHP 8.1 or higher
- MySQL 5.7 or higher
- Node.js 18.0 or higher
- Composer
- Web server (Apache/Nginx)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tauhusoya/inventorytest.git
   cd inventorytest
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   - Update `.env` file with your database credentials
   - Run migrations and seeders:
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Build assets**
   ```bash
   npm run dev
   ```

7. **Start development server**
   ```bash
   php artisan serve
   ```

## Development

### Local Development

1. Clone the repository
2. Install dependencies: `composer install && npm install`
3. Copy `.env.example` to `.env` and configure
4. Run migrations: `php artisan migrate`
5. Start development server: `php artisan serve`
6. Build assets: `npm run dev`

### Testing

```bash
php artisan test
```

## License

This project is licensed under the MIT License.
