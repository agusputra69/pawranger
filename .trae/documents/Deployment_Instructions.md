# Deployment Instructions - Pawranger Website

## Overview

This document provides comprehensive instructions for deploying the Pawranger pet care services website to various hosting platforms and environments.

## Prerequisites

### System Requirements
- Node.js 18.0 or higher
- npm 9.0 or higher
- Git 2.0 or higher
- Modern web browser for testing

### Development Tools
- Code editor (VS Code recommended)
- Terminal/Command line access
- Git client

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/pawranger-website.git
cd pawranger-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create environment files for different stages:

#### `.env.local` (Local Development)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_ENVIRONMENT=development

# Payment Gateway (Test)
VITE_PAYMENT_GATEWAY_URL=https://sandbox-payment.example.com
VITE_PAYMENT_PUBLIC_KEY=pk_test_your_test_key

# Analytics (Development)
VITE_ANALYTICS_ID=GA_DEV_TRACKING_ID
VITE_ENABLE_ANALYTICS=false

# Feature Flags
VITE_ENABLE_BOOKING=true
VITE_ENABLE_ECOMMERCE=true
VITE_ENABLE_USER_AUTH=true

# Debug Settings
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

#### `.env.staging` (Staging Environment)
```bash
# API Configuration
VITE_API_BASE_URL=https://staging-api.pawranger.com
VITE_ENVIRONMENT=staging

# Payment Gateway (Test)
VITE_PAYMENT_GATEWAY_URL=https://staging-payment.pawranger.com
VITE_PAYMENT_PUBLIC_KEY=pk_staging_your_staging_key

# Analytics (Staging)
VITE_ANALYTICS_ID=GA_STAGING_TRACKING_ID
VITE_ENABLE_ANALYTICS=true

# Feature Flags
VITE_ENABLE_BOOKING=true
VITE_ENABLE_ECOMMERCE=true
VITE_ENABLE_USER_AUTH=true

# Debug Settings
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=warn
```

#### `.env.production` (Production Environment)
```bash
# API Configuration
VITE_API_BASE_URL=https://api.pawranger.com
VITE_ENVIRONMENT=production

# Payment Gateway (Live)
VITE_PAYMENT_GATEWAY_URL=https://payment.pawranger.com
VITE_PAYMENT_PUBLIC_KEY=pk_live_your_live_key

# Analytics (Production)
VITE_ANALYTICS_ID=GA_PRODUCTION_TRACKING_ID
VITE_ENABLE_ANALYTICS=true

# Feature Flags
VITE_ENABLE_BOOKING=true
VITE_ENABLE_ECOMMERCE=true
VITE_ENABLE_USER_AUTH=true

# Debug Settings
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error

# Security
VITE_SECURE_MODE=true
VITE_ENABLE_CSP=true
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build Process

### Development Build
```bash
# Build with development environment
npm run build:dev
```

### Staging Build
```bash
# Build with staging environment
npm run build:staging
```

### Production Build
```bash
# Build with production environment
npm run build
```

### Build Verification
```bash
# Preview production build locally
npm run preview

# Run tests
npm run test

# Run linting
npm run lint

# Check bundle size
npm run analyze
```

## Deployment Platforms

### 1. Vercel Deployment

#### Automatic Deployment (Recommended)
1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy automatically on push to main branch

#### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Vercel Configuration (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 2. Netlify Deployment

#### Automatic Deployment
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables
5. Deploy on push to main branch

#### Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 3. GitHub Pages Deployment

#### GitHub Actions Workflow (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test
      
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        VITE_PAYMENT_GATEWAY_URL: ${{ secrets.VITE_PAYMENT_GATEWAY_URL }}
        VITE_ANALYTICS_ID: ${{ secrets.VITE_ANALYTICS_ID }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 4. AWS S3 + CloudFront Deployment

#### S3 Bucket Setup
```bash
# Create S3 bucket
aws s3 mb s3://pawranger-website

# Configure bucket for static website hosting
aws s3 website s3://pawranger-website --index-document index.html --error-document index.html
```

#### Deploy to S3
```bash
# Build application
npm run build

# Sync to S3
aws s3 sync dist/ s3://pawranger-website --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### CloudFront Configuration
```json
{
  "Origins": [
    {
      "DomainName": "pawranger-website.s3.amazonaws.com",
      "Id": "S3-pawranger-website",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-pawranger-website",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "DefaultTTL": 86400
  },
  "CustomErrorResponses": [
    {
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html"
    }
  ]
}
```

## Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration (`nginx.conf`)
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile        on;
    keepalive_timeout  65;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    server {
        listen       80;
        server_name  localhost;
        
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

### Docker Commands
```bash
# Build Docker image
docker build -t pawranger-website .

# Run container
docker run -p 80:80 pawranger-website

# Run with environment variables
docker run -p 80:80 -e VITE_API_BASE_URL=https://api.pawranger.com pawranger-website
```

### Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=https://api.pawranger.com
      - VITE_PAYMENT_GATEWAY_URL=https://payment.pawranger.com
    restart: unless-stopped
    
  # Optional: Add reverse proxy
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
      - ./proxy.conf:/etc/nginx/nginx.conf
    depends_on:
      - web
```

## Environment-Specific Configurations

### Development Environment
- Hot module replacement enabled
- Source maps included
- Debug logging enabled
- Mock APIs for testing
- Development analytics disabled

### Staging Environment
- Production-like build
- Staging APIs
- Limited analytics
- Error tracking enabled
- Performance monitoring

### Production Environment
- Optimized build
- Minified assets
- Production APIs
- Full analytics enabled
- Error tracking and monitoring
- Security headers enforced

## Post-Deployment Checklist

### Functional Testing
- [ ] Homepage loads correctly
- [ ] Navigation works properly
- [ ] Service booking system functional
- [ ] E-commerce features working
- [ ] User authentication operational
- [ ] Cart and checkout process
- [ ] Payment gateway integration
- [ ] Contact forms submitting
- [ ] Mobile responsiveness

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Images optimized and loading
- [ ] JavaScript bundles optimized
- [ ] CSS properly minified

### Security Testing
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] No sensitive data exposed
- [ ] Input validation working
- [ ] Authentication secure
- [ ] Payment data encrypted

### SEO and Analytics
- [ ] Meta tags present
- [ ] Structured data implemented
- [ ] Analytics tracking working
- [ ] Search console configured
- [ ] Sitemap submitted
- [ ] Social media tags present

## Monitoring and Maintenance

### Application Monitoring
```javascript
// Error tracking setup
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_ENVIRONMENT,
  tracesSampleRate: 1.0,
});

// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Health Checks
```bash
#!/bin/bash
# health-check.sh

# Check if website is accessible
response=$(curl -s -o /dev/null -w "%{http_code}" https://pawranger.com)

if [ $response -eq 200 ]; then
    echo "Website is healthy"
    exit 0
else
    echo "Website is down (HTTP $response)"
    exit 1
fi
```

### Backup Strategy
- Daily automated backups
- Version control for code
- Database backups (if applicable)
- Configuration backups
- Recovery procedures documented

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
npm --version

# Verify environment variables
echo $VITE_API_BASE_URL
```

#### Deployment Issues
```bash
# Check build output
ls -la dist/

# Verify file permissions
chmod -R 755 dist/

# Test locally
npm run preview
```

#### Runtime Errors
```bash
# Check browser console
# Verify API endpoints
# Check network requests
# Review error logs
```

### Support Contacts
- **Development Team**: dev@pawranger.com
- **DevOps Team**: devops@pawranger.com
- **Emergency Contact**: +62-xxx-xxx-xxxx

## Rollback Procedures

### Vercel Rollback
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Manual Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard [commit-hash]
git push --force origin main
```

### Emergency Procedures
1. Identify the issue
2. Assess impact and urgency
3. Implement immediate fix or rollback
4. Communicate with stakeholders
5. Document incident and resolution
6. Conduct post-mortem analysis