# Apps Script CORS Update Instructions

## Problem
Your Apps Script backend is blocking CORS requests from `http://localhost:8080`. The error shows:
```
Access to fetch at 'https://script.google.com/...' from origin 'http://localhost:8080' has been blocked by CORS policy
```

## Solution
Update your Apps Script `Code.gs` file to include CORS headers.

## Steps to Update

### 1. Open Your Apps Script Project
- Go to [Google Apps Script](https://script.google.com)
- Open your "Last Resort" project

### 2. Update Code.gs
I've created an updated `Code.gs` file in this directory with CORS support. You need to:

**Option A: Copy the entire file**
- Open the `Code.gs` file I created in this project
- Copy all its contents
- Replace the entire contents of your Apps Script `Code.gs` file

**Option B: Manual update (if you prefer)**
Add these changes to your existing `Code.gs`:

1. **Add CORS helper function** (after the helpers section):
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

2. **Update `respond_` function**:
```javascript
function respond_(obj){
  return setCorsHeaders_(
    ContentService.createTextOutput(JSON.stringify(obj))
  );
}
```

3. **Add `doOptions` function** (for CORS preflight requests):
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

### 3. Save and Redeploy
1. Click **Save** (Ctrl+S or Cmd+S)
2. Go to **Deploy** → **Manage deployments**
3. Click the **pencil icon** (edit) on your existing deployment
4. Click **Deploy** (you don't need to change the version - it will update automatically)
5. Make sure the deployment settings are:
   - **Execute as**: Me
   - **Who has access**: Anyone

### 4. Test
1. Go back to `http://localhost:8080`
2. Refresh the page (F5)
3. Try logging in
4. Check the browser console (F12) - CORS errors should be gone

## What Changed

The updated code:
- ✅ Adds CORS headers to all API responses
- ✅ Handles OPTIONS preflight requests
- ✅ Allows requests from any origin (`*`) - you can restrict this later if needed

## Security Note

Using `'Access-Control-Allow-Origin': '*'` allows requests from any domain. For production, you might want to restrict this to specific domains:

```javascript
'Access-Control-Allow-Origin': 'https://yourdomain.com'
```

But for now, `*` is fine for development and testing.

## Verification

After updating, you should see:
- ✅ No CORS errors in browser console
- ✅ Login/signup works
- ✅ API calls succeed
- ✅ All features work as expected

If you still see errors, make sure you:
1. Saved the Apps Script file
2. Redeployed the web app
3. Refreshed your browser (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)

