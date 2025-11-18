# Deployment Guide

## Current Setup

The app is deployed on **Cloudflare Pages** with automatic deployments from GitHub.

## Deployment Architecture

```
GitHub Repository
    ↓ (push)
Cloudflare Pages
    ↓ (auto-deploy)
https://last-resort.pages.dev
```

## Automatic Deployment

Every push to the `main` branch automatically triggers a Cloudflare Pages deployment.

**To deploy:**
```bash
git add .
git commit -m "Your changes"
git push
```

Cloudflare Pages will automatically:
1. Clone the repository
2. Build the site (no build step needed - static site)
3. Deploy to global CDN
4. Make it live in 1-2 minutes

## Manual Deployment

If needed, you can manually trigger a deployment:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → Your project
3. Click **Retry deployment** or **Create deployment**

## Deployment Settings

Current configuration:
- **Framework**: None (static site)
- **Build command**: (empty)
- **Build output directory**: `/` (root)
- **Root directory**: (empty)

## Cloudflare Worker Function

The `functions/api-proxy.js` file is automatically deployed as a Cloudflare Worker function.

**Location**: `https://last-resort.pages.dev/api-proxy`

This handles CORS for Apps Script requests.

## Custom Domain

To add a custom domain:

1. Go to Cloudflare Dashboard → Pages → Your project
2. Click **Custom domains** → **Set up a custom domain**
3. Enter your domain
4. Follow DNS configuration instructions

## Environment Variables

No environment variables are currently used. All configuration is in code.

## Rollback

To rollback to a previous deployment:

1. Cloudflare Dashboard → Pages → Your project
2. Go to **Deployments** tab
3. Find the deployment you want
4. Click **...** → **Retry deployment**

## Build Logs

To view build logs:

1. Cloudflare Dashboard → Pages → Your project
2. Go to **Deployments** tab
3. Click on any deployment
4. View build logs

## Troubleshooting

### Build Fails

- Check that `index.html` exists in root
- Verify `_redirects` file syntax
- Check build logs for specific errors

### Worker Function Not Working

- Verify `functions/api-proxy.js` exists
- Check Functions tab in Cloudflare Dashboard
- Verify the file is committed to git

### Files Not Deploying

- Check `.gitignore` - files might be excluded
- Verify files are committed: `git status`
- Check build output directory setting
