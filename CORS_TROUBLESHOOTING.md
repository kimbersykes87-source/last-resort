# CORS Troubleshooting Guide

## The Problem
Even after updating Code.gs and redeploying, CORS errors persist. This is a common issue with Apps Script web apps.

## Why This Happens

Apps Script web apps have limitations with CORS:
1. The `doOptions()` function might not be called properly
2. CORS headers might not be set correctly
3. There might be a delay in deployment propagation
4. Browser caching might be interfering

## Solution 1: Verify Apps Script Code

### Check 1: Verify doOptions exists
1. Go to https://script.google.com
2. Open your project
3. Check that `Code.gs` has a `doOptions` function:
```javascript
function doOptions(e){
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    });
}
```

### Check 2: Verify respond_ uses CORS
Make sure `respond_` function looks like this:
```javascript
function respond_(obj){
  return setCorsHeaders_(
    ContentService.createTextOutput(JSON.stringify(obj))
  );
}
```

And `setCorsHeaders_` exists:
```javascript
function setCorsHeaders_(output){
  return output
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    });
}
```

## Solution 2: Create a New Deployment

Sometimes updating an existing deployment doesn't work. Try creating a fresh deployment:

1. In Apps Script, go to **Deploy** → **Manage deployments**
2. Click the **trash icon** to delete the old deployment (or keep it for backup)
3. Click **New deployment**
4. Click the **gear icon** (⚙️) next to "Select type"
5. Choose **Web app**
6. Settings:
   - **Execute as**: Me
   - **Who has access**: Anyone
7. Click **Deploy**
8. **Copy the new URL**
9. Update `app.js` with the new URL:
   ```javascript
   API_URL: 'https://script.google.com/macros/s/YOUR_NEW_ID/exec'
   ```
10. Save and refresh your local app

## Solution 3: Test the Deployment Directly

1. Open `test-cors.html` in your browser (I created this file)
2. Click "Test CORS"
3. Check what errors you see
4. This will help diagnose if it's a CORS issue or something else

## Solution 4: Use a CORS Proxy (Temporary Workaround)

For local development only, you can use a CORS proxy:

1. Update `app.js` to use a proxy:
```javascript
// For local development only
var CONSTANTS = {
  API_URL: window.location.hostname === 'localhost' 
    ? 'https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbzZkUPWFnQl44kqWzo4sMTrxzkOoxYdVFguOln0kju2NgvzlFl9V8oSIoXhnTwUazuSbg/exec'
    : 'https://script.google.com/macros/s/AKfycbzZkUPWFnQl44kqWzo4sMTrxzkOoxYdVFguOln0kju2NgvzlFl9V8oSIoXhnTwUazuSbg/exec'
};
```

**Note**: CORS proxies are not recommended for production and may have rate limits.

## Solution 5: Deploy Frontend to Same Domain

The best long-term solution is to deploy your frontend to a proper domain and configure CORS to allow only that domain:

1. Deploy to Cloudflare Pages (or similar)
2. Get your domain (e.g., `https://lastresort.yourdomain.com`)
3. Update Apps Script CORS to allow only that domain:
```javascript
'Access-Control-Allow-Origin': 'https://lastresort.yourdomain.com'
```

## Verification Steps

After trying any solution:

1. **Hard refresh browser**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache**: Or use incognito/private mode
3. **Wait 1-2 minutes**: Apps Script changes can take time to propagate
4. **Check browser console**: Look for specific error messages
5. **Test with test-cors.html**: This will show exactly what's happening

## Most Likely Fix

**Try Solution 2** (Create a new deployment) - this often resolves CORS issues that persist after updating an existing deployment.

## Still Not Working?

If none of these work, the issue might be:
1. Apps Script web app permissions
2. Browser security settings
3. Network/firewall blocking

In that case, deploying to Cloudflare Pages (which will be on HTTPS) and configuring CORS properly is the best solution.

