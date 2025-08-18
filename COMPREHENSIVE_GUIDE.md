# 🚀 Complete Cloud Infrastructure & Deployment Guide
## From Zero to Senior DevOps Engineer

---

## 📖 Table of Contents
1. [🎯 Understanding the Big Picture](#-understanding-the-big-picture)
2. [🏗️ Infrastructure Components](#️-infrastructure-components)
3. [🔧 Step-by-Step Deployment](#-step-by-step-deployment)
4. [📊 Monitoring & Maintenance](#-monitoring--maintenance)
5. [🚀 Advanced Features](#-advanced-features)
6. [💡 Real-World Scenarios](#-real-world-scenarios)
7. [📈 Career Path & Next Steps](#-career-path--next-steps)

---

## 🎯 Understanding the Big Picture

### 🌍 What We're Building (The Analogy)

Think of your website like a **restaurant business**:

| **Restaurant Component** | **Our Website Component** | **Why It Matters**               |
| ------------------------ | ------------------------- | -------------------------------- |
| **Kitchen**              | Next.js Application       | Where your content is prepared   |
| **Waiters**              | Nginx Server              | They serve customers (users)     |
| **Manager**              | PM2 Process Manager       | Ensures everything runs smoothly |
| **Building**             | AWS EC2 Instance          | Your restaurant's location       |
| **Security Guard**       | Firewall & SSL            | Protects your customers          |
| **Menu**                 | DNS Configuration         | Tells people where to find you   |

### 🔄 How Everything Works Together

```
Internet User → DNS (rea.sopheap.dev) → AWS EC2 → Nginx → Next.js App
     ↓              ↓                    ↓         ↓         ↓
   Browser    Points to IP        Server    Proxy    Your Website
```

---

## 🏗️ Infrastructure Components

### 1. 🖥️ AWS EC2 (Your Server)
**What it is**: A virtual computer in the cloud
**Analogy**: Like renting a computer in a data center

**Key Features**:
- **Ubuntu 24.04 LTS**: Operating system (like Windows/Mac)
- **t2.micro**: Computer specifications (1 CPU, 1GB RAM)
- **Public IP**: Your server's address on the internet

**Real-World Example**:
```
Your Home Computer ←→ Internet ←→ AWS Data Center ←→ Your Virtual Server
```

### 2. 🌐 Nginx (Web Server)
**What it is**: Software that handles web requests
**Analogy**: Like a smart receptionist who directs visitors

**What it does**:
- Receives requests from browsers
- Serves static files (images, CSS, JavaScript)
- Forwards dynamic requests to your Next.js app
- Handles SSL/HTTPS encryption

**Configuration Example**:
```nginx
server {
    listen 80;                    # Listen on port 80 (HTTP)
    server_name rea.sopheap.dev;  # Your domain name
    
    location / {
        proxy_pass http://localhost:3000;  # Forward to Next.js
    }
}
```

### 3. ⚡ Next.js (Your Application)
**What it is**: A React framework for building websites
**Analogy**: Like a smart kitchen that prepares different dishes

**Key Features**:
- **Server-Side Rendering**: Pre-cooks pages for faster delivery
- **Static Generation**: Creates pages in advance
- **API Routes**: Handles data requests
- **TypeScript**: Adds type safety (like having a recipe book)

### 4. 🔄 PM2 (Process Manager)
**What it is**: Keeps your application running
**Analogy**: Like a restaurant manager who ensures the kitchen never stops

**What it does**:
- Starts your application automatically
- Restarts if it crashes
- Monitors performance
- Runs on system startup

---

## 🔧 Step-by-Step Deployment

### Phase 1: Server Setup 🖥️

#### Step 1: Create EC2 Instance
```bash
# This is what we did in AWS Console
1. Launch EC2 Instance
2. Choose Ubuntu 24.04 LTS
3. Select t2.micro
4. Configure Security Group (open ports 22, 80, 443)
5. Launch and get your key pair
```

#### Step 2: Connect to Server
```bash
# Connect via SSH
ssh -i your-key.pem ubuntu@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y
```

#### Step 3: Install Dependencies
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install SSL tools
sudo apt install certbot python3-certbot-nginx -y
```

### Phase 2: Application Deployment 🚀

#### Step 1: Clone Your Project
```bash
# Navigate to projects directory
cd /home/ubuntu/projects/AI/

# Clone your repository
git clone https://github.com/sopheap-it/recommendation-engine-algorithm.git

# Navigate to project
cd recommendation-engine-algorithm
```

#### Step 2: Build and Start Application
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup auto-start
pm2 startup
```

#### Step 3: Configure Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/recommendation-engine

# Enable the site
sudo ln -s /etc/nginx/sites-available/recommendation-engine /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Phase 3: Domain & SSL Setup 🔒

#### Step 1: Configure DNS
**In your DNS provider (Spaceship.com)**:
```
Type: A Record
Name: rea
Value: 18.136.209.47 (your EC2 public IP)
TTL: 300
```

#### Step 2: Setup SSL Certificate
```bash
# Wait for DNS propagation (24-48 hours)
# Then run:
sudo certbot --nginx -d rea.sopheap.dev
```

---

## 📊 Monitoring & Maintenance

### 1. 🔍 Health Checks
```bash
# Check application status
pm2 status
pm2 logs recommendation-engine

# Check Nginx status
sudo systemctl status nginx

# Check server resources
htop
df -h
```

### 2. 📈 Performance Monitoring
```bash
# Monitor PM2 processes
pm2 monit

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Monitor system resources
free -h
iostat
```

### 3. 🔄 Update Process
```bash
# Update your application
cd /home/ubuntu/projects/AI/recommendation-engine-algorithm
git pull origin main
npm install
npm run build
pm2 restart recommendation-engine
```

---

## 🚀 Advanced Features

### 1. 🐳 Docker Containerization
**What it is**: Package your app with all dependencies
**Benefits**: Consistent environment, easy deployment

```dockerfile
# Dockerfile example
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. 🔄 CI/CD Pipeline
**What it is**: Automate testing and deployment
**Benefits**: Faster updates, fewer errors

```yaml
# GitHub Actions example
name: Deploy to EC2
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /home/ubuntu/projects/AI/recommendation-engine-algorithm
            git pull origin main
            npm install
            npm run build
            pm2 restart recommendation-engine
```

### 3. 📊 Monitoring Stack
**Prometheus + Grafana**: Monitor server metrics
**ELK Stack**: Log analysis and visualization

---

## 💡 Real-World Scenarios

### Scenario 1: High Traffic
**Problem**: Your website gets 10,000 visitors per minute
**Solution**: 
- Scale horizontally (add more EC2 instances)
- Use load balancer
- Implement caching (Redis)
- Use CDN for static files

### Scenario 2: Database Integration
**Problem**: Need to store user data
**Solution**:
- Add PostgreSQL/MySQL database
- Use connection pooling
- Implement backup strategies
- Monitor database performance

### Scenario 3: Security Breach
**Problem**: Someone tries to hack your server
**Solution**:
- Implement WAF (Web Application Firewall)
- Regular security updates
- Monitor access logs
- Use intrusion detection systems

---

## 📈 Career Path & Next Steps

### 🎯 Immediate Next Steps (Next 2 weeks)
1. **Learn Docker**: Containerize your application
2. **Setup Monitoring**: Implement basic health checks
3. **Create CI/CD**: Automate deployment process
4. **Database Setup**: Add PostgreSQL/MySQL

### 🚀 Intermediate Goals (Next 2 months)
1. **Kubernetes**: Learn container orchestration
2. **Terraform**: Infrastructure as Code
3. **AWS Services**: Explore RDS, S3, CloudFront
4. **Security**: Implement proper IAM and VPC

### 🏆 Advanced Goals (Next 6 months)
1. **Microservices**: Break app into smaller services
2. **Performance**: Implement caching and CDN
3. **Disaster Recovery**: Multi-region setup
4. **Cost Optimization**: Reserved instances, spot pricing

### 💼 Job Roles You Can Target
- **DevOps Engineer**: $80,000 - $150,000
- **Site Reliability Engineer**: $90,000 - $180,000
- **Cloud Architect**: $100,000 - $200,000
- **Infrastructure Engineer**: $70,000 - $140,000

---

## 🔧 Troubleshooting Common Issues

### Issue 1: Application Won't Start
```bash
# Check PM2 logs
pm2 logs recommendation-engine

# Check if port is in use
sudo netstat -tlnp | grep :3000

# Restart PM2
pm2 restart recommendation-engine
```

### Issue 2: Nginx Not Serving Content
```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Issue 3: SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check DNS resolution
nslookup your-domain.com
```

---

## 📚 Learning Resources

### 🎥 Video Courses
- **AWS Certified Solutions Architect**: A Cloud Guru
- **Docker & Kubernetes**: The Complete Guide (Udemy)
- **DevOps Bootcamp**: Linux Academy

### 📖 Books
- **The Phoenix Project**: DevOps novel
- **Site Reliability Engineering**: Google's SRE book
- **Infrastructure as Code**: Managing servers in the cloud

### 🌐 Online Platforms
- **AWS Free Tier**: Practice with real services
- **Kubernetes Playground**: Learn K8s online
- **Terraform Learn**: Official HashiCorp tutorials

---

## 🎉 Congratulations!

You've successfully deployed a production-ready website! This is a significant achievement that puts you ahead of many developers.

**What you've accomplished**:
✅ Deployed Next.js application to production  
✅ Configured web server (Nginx)  
✅ Set up process management (PM2)  
✅ Configured domain and DNS  
✅ Implemented SSL security  
✅ Created professional documentation  

**Next milestone**: Add monitoring, CI/CD, and database integration

---

## 📞 Need Help?

- **Documentation**: Check this guide first
- **Community**: Stack Overflow, Reddit r/devops
- **Official Docs**: AWS, Nginx, Next.js documentation
- **Practice**: Build more projects, experiment with different setups

**Remember**: Every expert was once a beginner. Keep learning, keep building, and you'll reach senior level faster than you think! 🚀

---

*Last updated: August 15, 2025*  
*Created by: AI Assistant*  
*For: Sopheap Om & Team*
