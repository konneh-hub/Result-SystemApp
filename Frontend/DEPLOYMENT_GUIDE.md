# Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] API endpoints verified
- [ ] Build completes without errors
- [ ] No console warnings
- [ ] All routes working
- [ ] Authentication tested
- [ ] Forms validated
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] Performance metrics met

## Build for Production

```bash
# Install dependencies (if not done)
npm install

# Create production build
npm run build

# Preview production build
npm run preview
```

The build output is in the `dist/` directory.

## Deployment Options

### 1. Vercel (Recommended for Vite)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Benefits:**
- Zero-config deployment
- Automatic HTTPS
- CDN included
- Environment variables support
- Git integration

### 2. Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Features:**
- One-click deployment
- Continuous deployment from Git
- Built-in redirects
- Serverless functions
- Analytics

### 3. AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### 4. Docker + Container Registry

**Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and push:**
```bash
docker build -t slughub-frontend .
docker tag slughub-frontend your-registry/slughub-frontend:latest
docker push your-registry/slughub-frontend:latest
```

### 5. GitHub Pages

```bash
# Update package.json
"homepage": "https://yourusername.github.io/slughub"

# Build
npm run build

# Deploy
npm run deploy
```

## Environment Configuration

### Production .env
```env
VITE_API_URL=https://api.slughub.university.edu
VITE_APP_NAME=SLUGHUB Result Management System
VITE_JWT_STORAGE_KEY=slughub_token
```

### Staging .env
```env
VITE_API_URL=https://staging-api.slughub.university.edu
VITE_APP_NAME=SLUGHUB (Staging)
VITE_JWT_STORAGE_KEY=slughub_token_staging
```

## Performance Optimization

### Bundle Analysis
```bash
# Install analyzer
npm install --save-dev vite-plugin-visualizer

# View bundle
npm run build
```

### Code Splitting (Already configured in routes)
Routes are lazy-loaded for optimal performance.

### Image Optimization
- Use WebP format where possible
- Compress images (75-85% quality)
- Use responsive images
- Lazy load off-screen images

### Caching Strategy
- Cache-Control: max-age=31536000 (assets)
- Cache-Control: max-age=3600 (HTML)
- Cache-Control: no-cache (API responses)

## SEO Configuration

### Meta Tags
Add to `index.html`:
```html
<meta name="description" content="SLUGHUB Result Management System">
<meta name="keywords" content="university, results, management, system">
<meta property="og:title" content="SLUGHUB">
<meta property="og:description" content="University Result Management">
```

### robots.txt
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /lecturer
Disallow: /hod
Disallow: /dean
Disallow: /exam-officer
```

## Security Headers

Configure these on your server:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self'
```

## HTTPS Configuration

- Use TLS 1.2 or higher
- Get certificate from Let's Encrypt (free)
- Enable HSTS headers
- Redirect HTTP to HTTPS

## Database Migrations

If needed, run migrations on backend:
```bash
cd ../backend
npm run migrate
```

## Rollback Plan

### If Something Goes Wrong

1. **Immediate rollback**
   ```bash
   # Revert to previous version
   git revert HEAD
   npm run build
   # Redeploy
   ```

2. **Check logs**
   - Browser console (F12)
   - Network tab for API errors
   - Server logs

3. **Contact backend team**
   - Verify API is operational
   - Check database connectivity
   - Review recent changes

## Monitoring

### Setup Error Tracking

**Sentry Integration:**
```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Analytics

**Google Analytics:**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## Performance Monitoring

- Monitor page load times
- Track Core Web Vitals
- Monitor API response times
- Set up alerts for errors

## Backup & Recovery

1. **Database backups**
   - Daily automatic backups
   - 30-day retention

2. **Code backups**
   - Git repository (GitHub)
   - Docker image registry

3. **Recovery procedure**
   - Restore from backup
   - Run migrations if needed
   - Verify functionality

## Update Strategy

### Automatic Updates
- Security patches: Apply immediately
- Bug fixes: Apply within 24 hours
- Feature updates: Schedule during maintenance window

### Manual Updates
```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Test before deployment
npm run build
```

## Maintenance Window

**Recommended:**
- Time: 2:00 AM - 4:00 AM UTC
- Frequency: Monthly
- Duration: 1-2 hours
- Notification: 24 hours in advance

## Support & Escalation

**Issues Priority:**
1. **Critical**: System down → Immediate action
2. **High**: Features broken → Within 2 hours
3. **Medium**: Degraded performance → Within 24 hours
4. **Low**: Minor bugs → Within 1 week

---

**Deployment Checklist:**
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Staging verified
- [ ] Documentation updated
- [ ] Team notified
- [ ] Ready for production
