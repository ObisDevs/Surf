# 🚀 Deployment Guide — SurfAI Production

## 📋 Prerequisites

- GitHub repository
- Vercel account
- Supabase project (production)
- OpenAI API key
- Gemini API key

---

## 🔧 Setup Instructions

### 1. Vercel Setup

1. **Connect GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select root directory: `/web`

2. **Configure Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables, add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENAI_API_KEY=sk-...
   GEMINI_API_KEY=...
   NODE_ENV=production
   ```

3. **Get Vercel Tokens**
   
   For GitHub Actions auto-deployment:
   - Go to Vercel → Settings → Tokens
   - Create new token
   - Copy token for GitHub secrets

4. **Get Project IDs**
   
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and link project
   cd web
   vercel link
   
   # Get IDs from .vercel/project.json
   cat .vercel/project.json
   ```

---

### 2. GitHub Secrets Setup

Go to GitHub Repository → Settings → Secrets and variables → Actions

Add these secrets:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=team_xxxxx or user_xxxxx
VERCEL_PROJECT_ID=prj_xxxxx
```

---

### 3. Supabase Production Setup

1. **Enable RLS on all tables**
   ```sql
   ALTER TABLE public.ai_memory ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
   ```

2. **Run migrations**
   - Go to Supabase Dashboard → SQL Editor
   - Run both migration files from `/supabase/migrations/`

3. **Verify indexes**
   ```sql
   SELECT * FROM pg_indexes WHERE tablename IN ('ai_memory', 'user_profiles', 'logs');
   ```

---

### 4. Chrome Extension Configuration

Update `/extension/manifest.json` with production API URL:

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'; connect-src https://your-domain.vercel.app https://*.supabase.co"
  }
}
```

---

## 🔄 Deployment Workflow

### Automatic Deployment (Recommended)

1. **Push to main branch**
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```

2. **GitHub Actions automatically:**
   - Runs type checks
   - Builds extension
   - Deploys to Vercel
   - Updates production

3. **Monitor deployment**
   - GitHub Actions tab shows progress
   - Vercel dashboard shows deployment status

### Manual Deployment

```bash
# Deploy web app
cd web
vercel --prod

# Build extension
cd ../extension
npm run build

# Package for Chrome Web Store
./scripts/package.sh
```

---

## 🧪 Testing Production

### API Endpoints

```bash
# Test plan endpoint
curl -X POST https://your-domain.vercel.app/api/plan \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","goal":"test","context":"test","url":"test"}'

# Test vision endpoint
curl -X POST https://your-domain.vercel.app/api/vision \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","domElements":[],"imageUrl":"test","task":"test"}'
```

### Extension Testing

1. Load unpacked extension from `/extension/dist/`
2. Open browser console
3. Test API:
   ```javascript
   await window.surfai.reasonAndAct('user-123', 'test task');
   ```

---

## 📊 Monitoring

### Vercel Analytics
- Real-time function logs
- Performance metrics
- Error tracking

### Supabase Monitoring
- Database performance
- Query analytics
- RLS policy logs

---

## 🔒 Security Checklist

- [ ] All environment variables set in Vercel
- [ ] RLS enabled on all Supabase tables
- [ ] Service role key never exposed client-side
- [ ] CORS configured for extension origin
- [ ] Rate limiting active on all API routes
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced
- [ ] CSP headers configured

---

## 🚨 Rollback Procedure

If deployment fails:

1. **Vercel Rollback**
   - Go to Vercel Dashboard → Deployments
   - Click previous successful deployment
   - Click "Promote to Production"

2. **GitHub Revert**
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## 📈 Performance Optimization

- Enable Vercel Edge Functions for low latency
- Use Supabase connection pooling
- Implement Redis caching (optional)
- Optimize bundle sizes
- Enable image optimization

---

## 🆘 Troubleshooting

### Build Fails
```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check linting errors
```

### API Errors
- Check Vercel function logs
- Verify environment variables
- Test Supabase connection

### Extension Issues
- Check manifest.json CSP
- Verify API URL in production
- Check browser console for errors

---

**Status**: Ready for production deployment  
**Auto-deploy**: Enabled via GitHub Actions  
**Monitoring**: Vercel + Supabase dashboards
