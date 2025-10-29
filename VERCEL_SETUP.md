# Vercel Configuration Required

## Issue
The build is failing because Vercel is building from the repository root instead of the `/web` directory.

## Solution: Configure Root Directory in Vercel Dashboard

### Steps:

1. Go to your Vercel project dashboard
2. Click **Settings**
3. Go to **General** section
4. Find **Root Directory** setting
5. Set it to: `web`
6. Click **Save**
7. Redeploy

### Alternative: Use Vercel CLI

```bash
vercel --cwd web
```

Or link the project properly:
```bash
cd web
vercel link
vercel --prod
```

This tells Vercel to treat `/web` as the project root, which will fix all the import path issues.
