# Deployment Guide — FinApp Frontend (Railway + GCP)

## Architecture

- **Platform:** Railway (PaaS) with Next.js
- **Runtime:** Node.js 20 + npm
- **Build:** `npm run build` produces optimized Next.js bundle
- **Start:** `npm run start` runs Next.js production server
- **Environment:** Production

## Prerequisites

1. Railway account: https://railway.app
2. Backend deployed to Railway (API endpoint required)
3. GitHub account with repo access

## Step 1: Create Railway Project for Frontend

```bash
# If not already in Railway CLI:
npm i -g @railway/cli
railway login

# Link frontend repo
cd finapp-frontend
railway init
```

Railway will create railway.json (already in repo).

## Step 2: Configure Environment Variables

Frontend needs `NEXT_PUBLIC_API_URL` to know where backend is:

```bash
railway variables set \
  NEXT_PUBLIC_API_URL="https://api.finapp-prod.railway.app"
```

Or via Railway dashboard:
1. Go to frontend project settings
2. Add in "Environment" tab
3. Set `NEXT_PUBLIC_API_URL=https://your-backend-railway-url`

### Available Variables

| Variable | Value | Example |
|----------|-------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | https://api.finapp-prod.railway.app |
| NODE_ENV | Environment | production |

**Note:** Only `NEXT_PUBLIC_*` vars are available in browser. Keep secrets server-side only.

## Step 3: Deploy

### Automatic (GitHub)

Railway auto-deploys on push to `main`:

```bash
git push origin main
```

Process:
1. GitHub Actions test workflow runs (test.yml)
2. Lint, type-check, build, E2E tests
3. If pass, Railway builds Docker image
4. Deploys to Railway infrastructure

### Manual (Railway CLI)

```bash
railway deploy
```

## Step 4: Verify Deployment

```bash
# Check logs
railway logs

# Test endpoint
curl https://app.finapp-prod.railway.app/

# Check health
curl https://app.finapp-prod.railway.app/login
```

## Custom Domain (Optional)

Railway provides auto domain: `finapp-frontend-prod.railway.app`

To use custom domain:
1. Dashboard → Frontend service → "Settings"
2. "Domain" tab → Add custom domain
3. Point DNS A/CNAME record to Railway nameserver
4. Wait for DNS propagation (~5-15 min)

## Environment Variables Sync

If backend URL changes:
1. Update `NEXT_PUBLIC_API_URL` in Railway dashboard
2. Trigger redeploy:
   - Push dummy commit to main, OR
   - Click "Redeploy" in Railway dashboard
3. Frontend rebuilds with new API URL

## Monitoring & Logs

Railway dashboard shows:
- Build logs (npm install, npm run build)
- Runtime logs (Next.js output)
- CPU/Memory usage
- Deployment history

Live logs:
```bash
railway logs --follow
```

## Optimize Build Time

Next.js builds can be slow. Optimize:

1. **Enable cache:** Railway caches npm modules between builds
2. **Skip E2E tests in CI:** Update test.yml `continue-on-error: true`
3. **Reduce bundle:** Check `npm run build` output

Typical build time: 2-5 minutes.

## Troubleshooting

### App won't start
- Check logs: `railway logs`
- Verify `NEXT_PUBLIC_API_URL` is set
- Ensure backend is running and accessible

### API requests fail from browser
- Check CORS headers from backend
- Verify backend URL in env var
- Browser console shows exact error

### Slow initial load
- First request hits cold server (Railway can scale down)
- Increase replicas in Railway settings for production
- Enable persistent caching

### Build fails
- Check npm ci install step
- Verify all dependencies in package.json
- Check for syntax errors: `npm run lint`

## Future: Migrate to GCP

When ready to migrate to GCP:

1. Export Railway environment variables
2. Set up GCP Cloud Run service (Next.js docker-compatible)
3. Update DNS to GCP load balancer
4. Update backend `CORS_ORIGINS` if needed

Architecture makes GCP migration seamless.

## Performance Tips

1. **ISR (Incremental Static Regeneration):** Cache pages server-side
2. **Image Optimization:** Next.js auto-optimizes images
3. **Code Splitting:** Next.js auto-splits per route
4. **Prefetching:** Use `<Link prefetch>` for faster navigation

Current setup includes best practices.

## Security Checklist

- [ ] `NEXT_PUBLIC_API_URL` points to HTTPS backend
- [ ] No secrets in `NEXT_PUBLIC_*` vars
- [ ] CORS properly configured on backend
- [ ] Content Security Policy headers set
- [ ] Environment-specific build (prod vs staging)
- [ ] No debug logs in production

## Support

- Railway Docs: https://docs.railway.app
- Next.js Docs: https://nextjs.org/docs
- Railway CLI: `railway help`
