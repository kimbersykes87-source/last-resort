# Deploy to Cloudflare Pages - Step by Step

## ✅ Git Repository Ready

Your code is now committed to git and ready to deploy!

## Step 1: Push to GitHub/GitLab/Bitbucket

### Option A: Create New Repository on GitHub

1. Go to [GitHub](https://github.com/new)
2. Create a new repository (e.g., "last-resort")
3. **Don't** initialize with README (we already have files)
4. Copy the repository URL

### Option B: Use Existing Repository

If you already have a repository, just get its URL.

### Push Your Code

Run these commands (replace `YOUR_REPO_URL` with your repository URL):

```bash
git remote add origin YOUR_REPO_URL
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/yourusername/last-resort.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Cloudflare Pages

### Via Cloudflare Dashboard (Easiest)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com/
   - Log in to your account

2. **Navigate to Pages**
   - Click "Workers & Pages" in the sidebar
   - Click "Pages" → "Create a project"

3. **Connect Your Repository**
   - Click "Connect to Git"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Cloudflare to access your repositories
   - Select your repository

4. **Configure Build Settings**
   - **Project name**: `last-resort` (or your choice)
   - **Production branch**: `main` (or `master`)
   - **Framework preset**: **None** (this is a static site)
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root directory)
   - **Root directory**: (leave empty, or `/` if needed)

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)

6. **Get Your URL**
   - Once deployed, you'll get a URL like: `https://last-resort.pages.dev`
   - This is your live site!

## Step 3: Test Your Deployment

1. Visit your Cloudflare Pages URL
2. Try logging in - it should work now! (HTTPS fixes CORS)
3. Test all functionality

## Step 4: Custom Domain (Optional)

1. In your Pages project, go to "Custom domains"
2. Click "Set up a custom domain"
3. Enter your domain name
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails

- Check that `index.html` is in the root directory
- Verify `_redirects` file is present
- Check build logs in Cloudflare dashboard

### CORS Still Not Working

- Make sure your Apps Script is deployed with "Anyone" access
- Verify the API URL in `app.js` matches your Apps Script deployment
- Check browser console for specific errors

### Files Not Showing

- Make sure all files are committed to git
- Check that files aren't in `.gitignore`
- Verify build output directory is set to `/`

## Next Steps

After deployment:
- ✅ Test login functionality
- ✅ Test all features
- ✅ Set up custom domain (if desired)
- ✅ Share your app!

## Need Help?

- Check Cloudflare Pages docs: https://developers.cloudflare.com/pages/
- Check build logs in Cloudflare dashboard
- Verify Apps Script deployment is correct

