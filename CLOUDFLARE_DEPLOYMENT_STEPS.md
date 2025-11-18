# Cloudflare Pages Deployment - Quick Steps

## ✅ Your Code is Ready!

All files are committed to git. Now follow these steps:

## Step 1: Push to GitHub

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `last-resort` (or your choice)
3. **Don't** check "Initialize with README" (we already have files)
4. Click "Create repository"

### Push Your Code

Copy and run these commands (GitHub will show them after creating the repo):

```bash
git remote add origin https://github.com/YOUR_USERNAME/last-resort.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

## Step 2: Deploy to Cloudflare Pages

### Via Dashboard

1. **Go to Cloudflare Dashboard**
   - https://dash.cloudflare.com/
   - Log in

2. **Create Pages Project**
   - Click "Workers & Pages" in sidebar
   - Click "Pages" → "Create a project"
   - Click "Connect to Git"

3. **Connect Repository**
   - Choose "GitHub" (or GitLab/Bitbucket)
   - Authorize Cloudflare
   - Select your `last-resort` repository

4. **Configure Build**
   - **Project name**: `last-resort`
   - **Production branch**: `main`
   - **Framework preset**: **None** ⚠️ (Important!)
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root)
   - **Root directory**: (leave empty)

5. **Deploy**
   - Click "Save and Deploy"
   - Wait 1-2 minutes

6. **Get Your URL**
   - You'll get: `https://last-resort.pages.dev`
   - **This is your live site!**

## Step 3: Test

1. Visit your Cloudflare Pages URL
2. Try logging in - **it should work!** (HTTPS fixes CORS)
3. Test all features

## What Happens Next

- ✅ Your app is live on Cloudflare Pages
- ✅ HTTPS automatically enabled (fixes CORS)
- ✅ Automatic deployments on every git push
- ✅ Free SSL certificate
- ✅ Global CDN

## Custom Domain (Optional)

1. In Pages project → "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain
4. Follow DNS instructions

## Need Help?

- Build logs: Check in Cloudflare dashboard
- CORS issues: Should be fixed with HTTPS
- Apps Script: Make sure it's deployed with "Anyone" access

---

**You're all set! Once you push to GitHub, you can deploy to Cloudflare Pages in just a few clicks.**

