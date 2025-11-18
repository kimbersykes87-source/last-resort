# Fix CORS - Step by Step

## The Issue
Apps Script web apps sometimes don't properly handle CORS when you **update** an existing deployment. The solution is to **create a NEW deployment**.

## Step-by-Step Fix

### Step 1: Verify Code.gs in Apps Script

1. Go to https://script.google.com
2. Open your "Last Resort" project
3. Open `Code.gs`
4. **Search for** `doOptions` (Ctrl+F)
5. Make sure you see this function:
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

If it's missing, copy the entire `Code.gs` file from your local directory and paste it into Apps Script, then **Save**.

### Step 2: Create a NEW Deployment

**This is the key step!** Creating a new deployment often fixes CORS issues.

1. In Apps Script, go to **Deploy** → **Manage deployments**
2. **Don't edit the old one** - create a new one instead
3. Click **New deployment** (the blue button)
4. Click the **gear icon** (⚙️) next to "Select type"
5. Choose **Web app**
6. Fill in:
   - **Description**: "Last Resort API v2" (or any name)
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
7. Click **Deploy**
8. **IMPORTANT**: Copy the new URL that appears
   - It will look like: `https://script.google.com/macros/s/AKfycbz.../exec`
   - **This is different from your old URL!**

### Step 3: Update app.js with New URL

1. Open `app.js` in your project
2. Find this line (around line 10):
```javascript
API_URL: 'https://script.google.com/macros/s/AKfycbzZkUPWFnQl44kqWzo4sMTrxzkOoxYdVFguOln0kju2NgvzlFl9V8oSIoXhnTwUazuSbg/exec'
```
3. Replace the URL with your **NEW deployment URL** from Step 2
4. Save the file

### Step 4: Test

1. Refresh your browser at `http://localhost:8080`
2. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Try logging in
4. Check browser console (F12) - CORS errors should be gone!

## Why This Works

When you **update** an existing deployment, Apps Script sometimes doesn't properly update the CORS handling. Creating a **new deployment** forces Apps Script to properly initialize all the CORS headers.

## If It Still Doesn't Work

1. **Wait 2-3 minutes** - Apps Script changes can take time
2. **Try incognito/private mode** - Rules out browser cache
3. **Check the new deployment URL** - Make sure you copied it correctly
4. **Verify Code.gs** - Make sure `doOptions` and `setCorsHeaders_` exist

## Quick Checklist

- [ ] Code.gs has `doOptions()` function
- [ ] Code.gs has `setCorsHeaders_()` function  
- [ ] Created a NEW deployment (not updated old one)
- [ ] Copied the NEW deployment URL
- [ ] Updated `app.js` with NEW URL
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tested login

This should fix your CORS issues!

