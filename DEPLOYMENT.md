# Deployment Guide

## Quick Start

### 1. Local Development

```bash
# Start local server
npm run dev
```

Visit `http://localhost:8080` in your browser.

### 2. Deploy to Cloudflare Pages

#### Via Dashboard (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Build settings:
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/`
6. Click "Save and Deploy"

#### Via Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy .
```

## Apps Script CORS Configuration

Your Apps Script backend needs to handle CORS. Update your `Code.gs` `respond_` function:

```javascript
function respond_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
```

Also add an OPTIONS handler for preflight requests:

```javascript
function doOptions(e){
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
```

## Testing

### Test Local Development

1. Start server: `npm run dev`
2. Open browser console
3. Check for any CORS or API errors
4. Test login/signup functionality

### Test Production

1. Deploy to Cloudflare Pages
2. Visit your Pages URL
3. Test all functionality
4. Check browser console for errors

## Common Issues

### CORS Errors

**Symptom**: Browser console shows CORS policy errors

**Solution**: 
- Ensure Apps Script `respond_` function includes CORS headers (see above)
- Verify Apps Script web app is deployed with "Anyone" access
- Check that API URL in `app.js` is correct

### API Not Responding

**Symptom**: Network requests fail or timeout

**Solution**:
- Verify Apps Script web app URL is correct in `app.js`
- Test the URL directly in browser or with curl
- Check Apps Script execution logs for errors

### Build Fails on Cloudflare

**Symptom**: Deployment fails in Cloudflare Pages

**Solution**:
- Ensure `_redirects` file is in root directory
- Check that build command is empty (static site)
- Verify all file paths are relative, not absolute

## Environment-Specific Configuration

If you need different API URLs for development vs production:

1. Create `config.js`:
```javascript
window.APP_CONFIG = {
  API_URL: window.location.hostname === 'localhost' 
    ? 'https://your-dev-apps-script-url/exec'
    : 'https://your-prod-apps-script-url/exec'
};
```

2. Include in `index.html` before `app.js`:
```html
<script src="config.js"></script>
<script src="app.js"></script>
```

3. Update `app.js`:
```javascript
var CONSTANTS = {
  API_URL: window.APP_CONFIG?.API_URL || 'https://script.google.com/macros/s/.../exec'
};
```

## File Checklist

Before deploying, ensure you have:

- [ ] `index.html` - Main HTML file
- [ ] `app.js` - JavaScript with correct API URL
- [ ] `_redirects` - Cloudflare Pages routing
- [ ] `package.json` - For local dev (optional)
- [ ] `.gitignore` - Excludes node_modules, etc.

## Next Steps

After successful deployment:

1. Set up custom domain (optional)
2. Configure environment variables if needed
3. Set up monitoring/analytics
4. Test on multiple devices/browsers

