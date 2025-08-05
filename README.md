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

## Production Deployment

### 🚀 Railway.app Deployment (Recommended)

The easiest way to deploy your application is using Railway.app with Docker:

1. **Connect your repository to Railway**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Add MySQL Database**
   - In your Railway project, click "New" → "Database" → "MySQL"
   - Note the database credentials

3. **Configure Environment Variables**
   - Set the required environment variables in Railway dashboard
   - See `RAILWAY_DEPLOYMENT.md` for detailed instructions

4. **Deploy**
   - Railway will automatically build and deploy your application
   - Your app will be available at the provided Railway URL

For detailed Railway deployment instructions, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

### 🐳 Docker Deployment

You can also deploy using Docker:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build the image manually
docker build -t inventory-app .
docker run -p 8000:80 inventory-app
```

### 🖥️ Traditional Server Deployment

For traditional server deployment:

**Prerequisites:**
- PHP 8.1 or higher
- MySQL 5.7 or higher
- Node.js 18.0 or higher
- Composer
- Web server (Apache/Nginx)

### Quick Deployment

#### Using Windows (PowerShell/Command Prompt):
```bash
deploy.bat
```

#### Using Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment Steps

1. **Install Dependencies**
   ```bash
   composer install --no-dev --optimize-autoloader
   npm install
   npm run build
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   ```bash
   php artisan migrate --force
   ```

4. **Production Optimization**
   ```bash
   php artisan optimize
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

5. **Set Permissions**
   ```bash
   chmod -R 755 storage bootstrap/cache
   chmod -R 755 public
   ```

### Environment Configuration

Update your `.env` file with production settings:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

### Security Checklist

- [ ] Set `APP_DEBUG=false`
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure proper file permissions
- [ ] Set up regular backups
- [ ] Use environment variables for sensitive data
- [ ] Disable Telescope in production

### Performance Optimization

- [ ] Enable OPcache
- [ ] Configure Redis for caching (optional)
- [ ] Set up CDN for static assets
- [ ] Configure database indexing
- [ ] Enable gzip compression

### Monitoring

- [ ] Set up error logging
- [ ] Configure application monitoring
- [ ] Set up database monitoring
- [ ] Monitor server resources

## Development

### Local Setup

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
