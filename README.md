# Inventory Management System

A modern Laravel-based inventory management system with React frontend, featuring user management, stock tracking, and comprehensive reporting.

## 🚀 Features

- **🔐 Authentication & Authorization**: Secure user management with role-based access
- **📦 Inventory Management**: Complete item and stock tracking system
- **📊 Reporting & Analytics**: Comprehensive dashboards and reports
- **🔄 Stock Transactions**: Track stock movements and aging
- **👥 User Management**: Admin panel for user administration
- **📱 Modern UI**: Responsive design with React and Tailwind CSS

## 🛠️ Technology Stack

- **Backend**: Laravel 10, PHP 8.1+
- **Frontend**: React 18, Inertia.js
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Charts**: Chart.js, Nivo Charts
- **Icons**: Lucide React

## 📋 Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- MySQL database

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tauhusoya/inventory.git
   cd inventory
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

## 📁 Project Structure

```
inventory/
├── app/
│   ├── Http/Controllers/    # Controllers
│   ├── Models/             # Eloquent models
│   └── Services/           # Business logic
├── resources/
│   └── js/                # React components
├── database/               # Migrations and seeders
├── routes/                # Route definitions
└── config/                # Configuration files
```

## 🎯 Key Features

### Authentication
- User registration and login
- Password reset functionality
- Role-based access control

### Inventory Management
- Add, edit, and delete items
- Track stock levels
- Set reorder levels
- SKU management

### Stock Transactions
- Stock in/out transactions
- Transaction history
- Stock aging tracking
- Batch management

### Dashboard
- Real-time statistics
- Low stock alerts
- Total inventory value
- Recent transactions

### User Management
- Admin panel for user management
- User roles and permissions
- Profile management

## 🧪 Testing

Run the test suite:
```bash
php artisan test
```

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👤 Author

**tauhusoya** - [GitHub](https://github.com/tauhusoya)

---

**🎉 Happy coding!**
