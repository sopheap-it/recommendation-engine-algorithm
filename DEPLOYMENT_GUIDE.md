# Next.js 15 Deployment Guide - AWS EC2 Ubuntu

## Prerequisites
- ✅ AWS EC2 Ubuntu instance (t2.micro) created
- ✅ Project cloned to VM
- 🔄 Domain/subdomain ready for configuration

## Step-by-Step Deployment Guide

### Step 1: Update System and Install Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS) and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL certificates
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: Configure Firewall (Security Groups)

Ensure your EC2 security group allows these ports:
- **Port 22 (SSH)**: For remote access
- **Port 80 (HTTP)**: For web traffic
- **Port 443 (HTTPS)**: For secure web traffic

```bash
# Configure UFW firewall (if not using security groups)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 3: Build and Test Your Next.js Application

```bash
# Navigate to your project directory
cd /home/ubuntu/projects/AI/recommendation-engine-algorithm

# Install dependencies
npm install

# Build the application for production
npm run build

# Test the build locally (optional)
npm start
# Press Ctrl+C to stop after testing
```

### Step 4: Configure PM2 for Process Management

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'recommendation-engine',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/projects/AI/recommendation-engine-algorithm',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions provided by the command above
```

### Step 5: Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/recommendation-engine
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name rea.sopheap.dev;  # Your subdomain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/recommendation-engine /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 6: Configure Domain/Subdomain

#### Option A: Using Route 53 (AWS DNS)
1. Go to AWS Route 53 console
2. Select your hosted zone
3. Create an A record:
   - **Name**: your-subdomain (e.g., `recommendation`)
   - **Type**: A
   - **Value**: Your EC2 instance's public IP address
   - **TTL**: 300

#### Option B: Using External DNS Provider
1. Log into your DNS provider's control panel
2. Add an A record:
   - **Name**: your-subdomain
   - **Type**: A
   - **Value**: Your EC2 instance's public IP address
   - **TTL**: 300

### Step 7: Configure SSL Certificate with Let's Encrypt

```bash
# Obtain SSL certificate
sudo certbot --nginx -d your-subdomain.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run

# Set up automatic renewal cron job (usually done automatically)
sudo crontab -e
# Add this line if not present:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### Step 8: Optimize Next.js Configuration

Update your `next.config.ts` for production:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Optimized for production
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Add your domain to allowed hosts if needed
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Step 9: Environment Variables (if needed)

```bash
# Create environment file
nano .env.local

# Add your environment variables
NODE_ENV=production
# Add other variables as needed

# Restart PM2 to pick up new environment variables
pm2 restart recommendation-engine
```

### Step 10: Monitoring and Maintenance

```bash
# Check application status
pm2 status
pm2 logs recommendation-engine

# Monitor system resources
htop
df -h

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Useful Commands for Maintenance

### Application Management
```bash
# Restart application
pm2 restart recommendation-engine

# Stop application
pm2 stop recommendation-engine

# View logs
pm2 logs recommendation-engine

# Monitor resources
pm2 monit
```

### Nginx Management
```bash
# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx configuration
sudo nginx -s reload

# Check Nginx status
sudo systemctl status nginx
```

### SSL Certificate Management
```bash
# Renew SSL certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

## Troubleshooting

### Common Issues and Solutions

1. **Application not starting**
   ```bash
   # Check PM2 logs
   pm2 logs recommendation-engine
   
   # Check if port 3000 is in use
   sudo netstat -tlnp | grep :3000
   ```

2. **Nginx not serving content**
   ```bash
   # Check Nginx configuration
   sudo nginx -t
   
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **SSL certificate issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Force renewal
   sudo certbot renew --force-renewal
   ```

4. **Domain not resolving**
   - Check DNS propagation: https://www.whatsmydns.net/
   - Verify A record points to correct IP
   - Wait for DNS propagation (can take up to 48 hours)

## Security Considerations

1. **Keep system updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Configure firewall properly**
   ```bash
   sudo ufw status
   ```

3. **Regular backups**
   ```bash
   # Backup your application
   tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/your/app
   ```

4. **Monitor logs regularly**
   ```bash
   # Set up log rotation
   sudo logrotate -f /etc/logrotate.conf
   ```

## Performance Optimization

1. **Enable Nginx caching**
2. **Use CDN for static assets**
3. **Implement database connection pooling (if applicable)**
4. **Monitor and optimize based on usage patterns**

## Next Steps

After deployment:
1. Test all functionality thoroughly
2. Set up monitoring and alerting
3. Configure automated backups
4. Set up CI/CD pipeline for future deployments
5. Monitor performance and optimize as needed

---

**Note**: Replace `your-subdomain.yourdomain.com` with your actual subdomain throughout this guide. Also, ensure your EC2 instance has enough storage space for your application and logs.
