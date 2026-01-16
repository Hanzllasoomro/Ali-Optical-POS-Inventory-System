# 🚀 Deployment Quick Reference Card

## Environment Variables Checklist

### Backend (`server/.env`)
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000` (or your port)
- [ ] `MONGO_URI=<your-mongodb-url>`
- [ ] `FRONTEND_URL=<https://yourdomain.com>`
- [ ] `JWT_ACCESS_SECRET=<32+ char random string>`
- [ ] `JWT_REFRESH_SECRET=<32+ char random string>`
- [ ] `ACCESS_TOKEN_EXPIRY=15m`
- [ ] `REFRESH_TOKEN_EXPIRY=7d`

### Frontend (`my-app/.env.local` or `.env.production`)
- [ ] `NEXT_PUBLIC_API_URL=<https://api.yourdomain.com>`

---

## Deployment Commands

### Local Development
```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd my-app
pnpm install
pnpm dev
```

### Production Build
```bash
# Backend - Just install, no build needed
cd server
npm install --production

# Frontend - Build for production
cd my-app
pnpm install
pnpm build
pnpm start
```

### Using PM2
```bash
npm install -g pm2
pm2 start server/src/server.js --name "ali-optical-api"
pm2 start my-app/node_modules/.bin/next --name "ali-optical-pos" -- start
pm2 save
pm2 startup
```

### Using Docker
```bash
# Build backend image
docker build -t ali-optical-api ./server

# Build frontend image
docker build -t ali-optical-pos ./my-app

# Run with docker-compose (create docker-compose.yml)
docker-compose up -d
```

---

## API Connectivity Test

### Health Check Endpoint
```bash
curl https://yourdomain.com/api/v1/health
```

Expected Response:
```json
{
  "status": "OK",
  "service": "Ali Optical POS Backend",
  "timestamp": "2026-01-16T10:00:00.000Z"
}
```

### CORS Verification
Test CORS headers with curl:
```bash
curl -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS https://api.yourdomain.com/api/v1/products
```

---

## Common Issues & Solutions

### Issue: 401 Unauthorized After Deployment
**Solution:** 
- Verify JWT secrets are correct in `.env`
- Check token expiry settings
- Ensure localStorage isn't blocked

### Issue: CORS Errors in Browser
**Solution:**
- Verify `FRONTEND_URL` in `server/.env` matches request origin exactly
- Check `NEXT_PUBLIC_API_URL` in frontend `.env` is correct
- Verify backend CORS settings in `server/config/cors.js`

### Issue: Cannot Connect to API
**Solution:**
- Verify backend is running on correct port
- Check firewall allows port 5000 (or configured port)
- Verify `NEXT_PUBLIC_API_URL` includes `/api/v1`
- Check MongoDB connection in `MONGO_URI`

### Issue: Environment Variables Not Loading
**Solution:**
- Ensure `.env` file is in correct directory
- Frontend: Use `NEXT_PUBLIC_` prefix for browser-accessible variables
- Backend: Restart server after `.env` changes
- Check `.env` file permissions

---

## File Locations Reference

| File | Purpose | Location |
|------|---------|----------|
| Backend env | Production config | `server/.env` |
| Frontend env | API endpoint | `my-app/.env.local` |
| CORS config | Origin validation | `server/config/cors.js` |
| API config | Axios setup | `my-app/services/api.ts` |
| Deployment guide | Full instructions | `DEPLOYMENT.md` |
| Changes summary | What was modified | `DEPLOYMENT_CHANGES.md` |

---

## Nginx Reverse Proxy (Quick Setup)

```nginx
# Frontend
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}

# Backend API
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

---

## Security Checklist

- [ ] JWT secrets are strong (32+ characters, random)
- [ ] `.env` files are in `.gitignore`
- [ ] HTTPS/SSL is enabled
- [ ] CORS is restricted to known origins
- [ ] MongoDB has authentication enabled
- [ ] Rate limiting is active (default: 300 req/15min)
- [ ] Source maps are disabled in production
- [ ] Credentials flag is set correctly in axios

---

## Monitoring & Logs

### PM2 Logs
```bash
pm2 logs ali-optical-api
pm2 logs ali-optical-pos
```

### Docker Logs
```bash
docker logs container-name -f
```

### Check Services
```bash
pm2 list
pm2 status ali-optical-api
```

---

## Rollback Procedure

```bash
# With PM2
pm2 restart ali-optical-api
pm2 restart ali-optical-pos

# With Docker
docker-compose down
docker-compose up -d

# Manual restart
cd server && npm start &
cd my-app && pnpm start &
```

---

## Performance Tips

1. **Frontend**: Use `pnpm` for faster installs
2. **Backend**: Run with `NODE_ENV=production`
3. **Database**: Add indexes on frequently queried fields
4. **Caching**: Configure browser caching headers
5. **CDN**: Serve static assets through CDN
6. **Compression**: Enable gzip compression in Nginx

---

## Useful Links & Commands

```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check Node version
node --version

# Check pnpm version
pnpm --version

# Clear pnpm cache
pnpm store prune

# Clean build artifacts
rm -rf my-app/.next
rm -rf server/node_modules
```

---

## Version Info

- **Node.js**: 18+
- **Next.js**: 16.1.1
- **React**: 19.2.3
- **Express**: 5.2.1
- **MongoDB**: 4.0+
- **Deployment Date**: January 2026

---

**Last Updated**: January 16, 2026
**Status**: ✅ Ready for Production Deployment
