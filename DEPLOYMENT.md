# Deployment Guide - Ali Optical POS Inventory System

## Pre-Deployment Setup

### 1. Environment Configuration

#### Backend Server (.env)
Create a `.env` file in the `server/` directory with the following variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=https://yourdomain.com
JWT_ACCESS_SECRET=your_secure_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_secure_refresh_secret_key_min_32_chars
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

**Important Security Notes:**
- Use strong, unique JWT secrets (minimum 32 characters)
- Never commit `.env` file to version control
- Use environment-specific values for each deployment

#### Frontend (.env.local or .env.production)
Create `.env.local` or `.env.production` file in `my-app/` directory:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**Note:** Use `NEXT_PUBLIC_` prefix to expose variables to the browser. This variable will be embedded in the build.

### 2. Build Process

#### Backend Build
```bash
cd server
npm install
```

#### Frontend Build
```bash
cd my-app
pnpm install
pnpm build
```

### 3. Deployment Options

#### Option A: Using PM2 (Recommended for VPS/Server)

**Backend:**
```bash
npm install -g pm2
pm2 start src/server.js --name "ali-optical-backend"
pm2 save
pm2 startup
```

**Frontend (Next.js):**
```bash
pnpm start
```

#### Option B: Using Docker

**Backend Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package*.json ./

EXPOSE 3000

CMD ["npm", "start"]
```

#### Option C: Using Vercel (Frontend Only)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables: `NEXT_PUBLIC_API_URL`
4. Deploy

### 4. CORS Configuration

The CORS is automatically configured to accept:
- `http://localhost:3000` (development)
- `http://localhost:5000` (development)
- The `FRONTEND_URL` from environment variables (production)

To add additional origins, update `server/config/cors.js`.

### 5. Health Check

Verify backend is running:
```bash
curl https://api.yourdomain.com/health
```

Expected response:
```json
{
  "status": "OK",
  "service": "Ali Optical POS Backend",
  "timestamp": "2026-01-16T10:00:00.000Z"
}
```

### 6. SSL/TLS Certificate

Use Let's Encrypt for free SSL:

**Using Certbot:**
```bash
sudo certbot certonly --standalone -d api.yourdomain.com
sudo certbot certonly --standalone -d yourdomain.com
```

Configure nginx or Apache to use the certificates.

### 7. Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. Production Checklist

- [ ] Update environment variables in `.env` files
- [ ] Set `NODE_ENV=production`
- [ ] Configure JWT secrets
- [ ] Set `FRONTEND_URL` to your domain
- [ ] Set `NEXT_PUBLIC_API_URL` to your API domain
- [ ] Test API connectivity
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Test all authentication flows
- [ ] Verify CORS headers
- [ ] Test payment/transaction flows (if applicable)

### 9. Monitoring

Monitor logs:
```bash
pm2 logs ali-optical-backend
```

### 10. Troubleshooting

**CORS Errors:**
- Verify `FRONTEND_URL` matches request origin exactly
- Check browser console for error details
- Ensure credentials are set to `true` in axios

**Authentication Issues:**
- Verify JWT secrets are set correctly
- Check token expiry times
- Ensure localStorage is accessible

**API Connection Issues:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check firewall/security groups allow port 5000
- Verify backend health endpoint responds

## Updates Made for Deployment

1. **Axios Configuration**: Now uses `NEXT_PUBLIC_API_URL` environment variable
2. **CORS Configuration**: Dynamic origin matching based on `FRONTEND_URL` env variable
3. **Environment Variables**: Comprehensive `.env.example` files created for both frontend and backend
4. **JWT Configuration**: Default expiry times added
5. **Security**: Added `withCredentials` to axios for cookie support
6. **Logging**: Added debug headers in CORS configuration

All frontend-backend linkage is now environment-driven and ready for production deployment.
