# Railway.app Deployment Guide

This guide will help you deploy your Laravel Inventory Management System to Railway.app using Docker.

## 🚀 Quick Deployment

### 1. Prerequisites

- [Railway account](https://railway.app)
- [GitHub repository](https://github.com) with your code
- MySQL database (Railway provides this)

### 2. Deploy to Railway

1. **Connect your repository**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Add MySQL Database**
   - In your Railway project, click "New"
   - Select "Database" → "MySQL"
   - Note down the database credentials

3. **Configure Environment Variables**
   - Go to your project settings
   - Add the following environment variables:

```env
APP_NAME="Inventory Management System"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-railway-domain.railway.app
APP_KEY=base64:your-generated-key

DB_CONNECTION=mysql
DB_HOST=your-mysql-host.railway.app
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=your-mysql-password

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
LOG_CHANNEL=stack
LOG_LEVEL=error

BROADCAST_DRIVER=log
FILESYSTEM_DISK=local
```

4. **Deploy**
   - Railway will automatically detect the Dockerfile
   - The build process will install dependencies and build assets
   - Your app will be available at the provided Railway URL

## 🔧 Configuration Details

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_ENV` | Application environment | `production` |
| `APP_DEBUG` | Debug mode (disable in production) | `false` |
| `APP_URL` | Your Railway app URL | `https://your-app.railway.app` |
| `DB_HOST` | MySQL host from Railway | `containers-us-west-1.railway.app` |
| `DB_PASSWORD` | MySQL password from Railway | `your-password` |

### Database Setup

1. **Get MySQL credentials from Railway**
   - Go to your MySQL service in Railway
   - Copy the connection details

2. **Run migrations**
   - Railway will automatically run migrations during deployment
   - Or manually run: `php artisan migrate --force`

## 📊 Monitoring

### Health Check
Your app includes a health check endpoint at `/health` that Railway uses to monitor the application status.

### Logs
- View logs in Railway dashboard
- Application logs are available in real-time
- Database logs are separate in the MySQL service

## 🔄 Updates

### Automatic Deployments
- Railway automatically deploys when you push to your main branch
- Each commit triggers a new build and deployment

### Manual Deployments
1. Push your changes to GitHub
2. Railway will automatically detect and deploy
3. Monitor the deployment in the Railway dashboard

## 🛠️ Troubleshooting

### Common Issues

1. **Build fails**
   - Check the build logs in Railway
   - Ensure all dependencies are in composer.json
   - Verify Dockerfile syntax

2. **Database connection fails**
   - Verify database credentials in environment variables
   - Check if MySQL service is running
   - Ensure database exists

3. **Application errors**
   - Check application logs in Railway
   - Verify environment variables are set correctly
   - Ensure APP_KEY is generated

### Debug Commands

```bash
# Check application status
curl https://your-app.railway.app/health

# View logs
# Use Railway dashboard to view logs

# Database connection test
# Add this to a route temporarily:
php artisan tinker
DB::connection()->getPdo();
```

## 📈 Performance Optimization

### Railway-specific optimizations:
- [x] Docker containerization
- [x] Nginx with gzip compression
- [x] PHP-FPM optimization
- [x] Static asset caching
- [x] Security headers

### Additional optimizations:
- [ ] Enable Redis for caching (Railway provides Redis)
- [ ] Configure CDN for static assets
- [ ] Optimize database queries
- [ ] Enable OPcache

## 🔒 Security

### Railway Security Features:
- [x] HTTPS automatically enabled
- [x] Environment variables encrypted
- [x] Isolated containers
- [x] Automatic security updates

### Application Security:
- [x] Debug mode disabled
- [x] Security headers configured
- [x] CSRF protection enabled
- [x] Input validation

## 💰 Cost Optimization

### Railway Pricing:
- Free tier available
- Pay-per-use pricing
- No hidden fees

### Cost-saving tips:
- Use Railway's free tier for development
- Monitor resource usage
- Optimize Docker image size
- Use efficient database queries

## 📞 Support

### Railway Support:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)

### Application Support:
- Check logs in Railway dashboard
- Use health check endpoint
- Monitor database connections

---

**Deployment Status**: ✅ Ready for Railway deployment
**Last Updated**: $(date)
**Version**: 1.0.0 