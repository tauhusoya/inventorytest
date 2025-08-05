# InfinityFree Deployment Guide

This guide will help you deploy your Laravel Inventory Management System to InfinityFree hosting using GitHub Actions.

## 🚀 Prerequisites

1. **InfinityFree Account**: Sign up at [infinityfree.net](https://infinityfree.net)
2. **GitHub Repository**: Your code should be on GitHub
3. **Domain**: Get a free subdomain from InfinityFree

## 📋 Step 1: Set Up InfinityFree

### 1.1 Create InfinityFree Account
1. Go to [infinityfree.net](https://infinityfree.net)
2. Sign up for a free account
3. Verify your email address

### 1.2 Create Hosting Account
1. Login to InfinityFree control panel
2. Click "Create Account"
3. Choose your subdomain (e.g., `inventory.infinityfreeapp.com`)
4. Note down your FTP credentials

### 1.3 Set Up Database
1. In InfinityFree control panel, go to "MySQL Databases"
2. Create a new database
3. Note down:
   - Database name
   - Username
   - Password
   - Host (usually `sql.infinityfree.com`)

## 🔧 Step 2: Configure GitHub Secrets

### 2.1 Add Repository Secrets
1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Add these secrets:

```
INFINITYFREE_FTP_SERVER=your-ftp-server.infinityfree.com
INFINITYFREE_FTP_USERNAME=your-ftp-username
INFINITYFREE_FTP_PASSWORD=your-ftp-password
INFINITYFREE_FTP_DIR=htdocs
APP_KEY=base64:your-generated-key
```

### 2.2 Generate Application Key
```bash
php artisan key:generate --show
```
Copy the output and use it as your `APP_KEY` secret.

## 🚀 Step 3: Deploy

### 3.1 Automatic Deployment
1. Push to your `main` or `master` branch
2. GitHub Actions will automatically deploy to InfinityFree
3. Check the Actions tab for deployment status

### 3.2 Manual Deployment
1. Go to your GitHub repository
2. Click "Actions" tab
3. Select "Deploy to InfinityFree" workflow
4. Click "Run workflow"

## ⚙️ Step 4: Post-Deployment Setup

### 4.1 Upload .env File
1. Download `infinityfree.env.example`
2. Rename to `.env`
3. Update with your InfinityFree database credentials
4. Upload via FTP to your hosting directory

### 4.2 Run Database Migrations
1. Access your InfinityFree control panel
2. Go to "Terminal" or use phpMyAdmin
3. Run these commands:
```bash
php artisan migrate --force
php artisan db:seed --force
```

### 4.3 Set File Permissions
Set these permissions via FTP:
```
storage/ - 755
bootstrap/cache/ - 755
public/ - 755
.env - 644
```

## 🔧 Step 5: Environment Configuration

### 5.1 Update .env File
```env
APP_NAME="Inventory Management System"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.infinityfreeapp.com

DB_CONNECTION=mysql
DB_HOST=sql.infinityfree.com
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
LOG_CHANNEL=stack
LOG_LEVEL=error
```

## 🐛 Troubleshooting

### Common Issues

1. **500 Error**
   - Check file permissions
   - Verify .env file exists
   - Check error logs in InfinityFree control panel

2. **Database Connection Error**
   - Verify database credentials
   - Check if database exists
   - Ensure MySQL is enabled

3. **Asset Loading Issues**
   - Run `npm run build` locally
   - Upload the `public/build` folder
   - Check if Vite assets are compiled

4. **Permission Errors**
   - Set storage directory to 755
   - Set bootstrap/cache to 755
   - Ensure .env is readable (644)

### Debug Mode
Temporarily enable debug mode:
```env
APP_DEBUG=true
```
Check the error logs in InfinityFree control panel.

## 📊 Monitoring

### 1. Check Deployment Status
- Go to GitHub Actions tab
- Monitor deployment progress
- Check for any errors

### 2. Test Your Application
- Visit your InfinityFree URL
- Test login/registration
- Verify all features work

### 3. Monitor Performance
- Use InfinityFree's built-in monitoring
- Check database usage
- Monitor disk space

## 🔒 Security Considerations

1. **Environment Variables**: Never commit .env file
2. **Database**: Use strong passwords
3. **File Permissions**: Set correct permissions
4. **HTTPS**: InfinityFree provides SSL certificates
5. **Updates**: Keep dependencies updated

## 📞 Support

If you encounter issues:

1. **Check InfinityFree Status**: [status.infinityfree.com](https://status.infinityfree.com)
2. **InfinityFree Documentation**: [infinityfree.net/docs](https://infinityfree.net/docs)
3. **GitHub Actions Logs**: Check the Actions tab in your repository
4. **Laravel Logs**: Check storage/logs/laravel.log

## 🎯 Production Checklist

- [ ] GitHub secrets configured
- [ ] Database created on InfinityFree
- [ ] .env file uploaded with correct settings
- [ ] Migrations run successfully
- [ ] File permissions set correctly
- [ ] Application accessible via URL
- [ ] All features working properly
- [ ] SSL certificate active
- [ ] Error logging configured

---

**🎉 Congratulations!** Your Laravel application is now deployed on InfinityFree! 