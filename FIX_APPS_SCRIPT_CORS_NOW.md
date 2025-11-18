# Fix Apps Script CORS - URGENT

## The Problem

Your Apps Script is **not returning CORS headers**, even though you're on HTTPS. The error shows:
```
No 'Access-Control-Allow-Origin' header is present on the requested resource
```

## The Fix - Step by Step

### Step 1: Open Apps Script

1. Go to https://script.google.com
2. Find your "Last Resort" project (the one with deployment URL ending in `AKfycbzSl4REI2WDdc4RvGiSNeoxNM6hbFMWx4qXwpHwDS2v60FolqlKdGetUhUefK1dX-DrcQ`)
3. Open `Code.gs`

### Step 2: Verify doOptions() Function Exists

**Search for `doOptions`** (Ctrl+F). You should see this function around line 131:

```javascript
function doOptions(e){
  var output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  // Try to set headers if method exists
  try {
    if (typeof output.setHeaders === 'function') {
      output.setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
      });
    }
  } catch (e) {
    // setHeaders not available
  }
  return output;
}
```

**If it's missing or different, replace it with the code above.**

### Step 3: Verify setCorsHeaders_() Function

**Search for `setCorsHeaders_`**. It should look like this (around line 105):

```javascript
function setCorsHeaders_(output){
  // Set MIME type
  output.setMimeType(ContentService.MimeType.JSON);
  // Note: setHeaders() may not be available on TextOutput in all Apps Script versions
  // CORS headers are handled by the deployment settings and doOptions() function
  return output;
}
```

### Step 4: CREATE A NEW DEPLOYMENT (Critical!)

**This is the most important step!** Creating a new deployment often fixes CORS:

1. In Apps Script, go to **Deploy** → **Manage deployments**
2. Click **New deployment** (the blue button)
3. Click the **gear icon** (⚙️) next to "Select type"
4. Choose **Web app**
5. Fill in:
   - **Description**: "Last Resort API - CORS Fixed"
   - **Execute as**: **Me** ⚠️ (Important!)
   - **Who has access**: **Anyone** ⚠️ (Important!)
6. Click **Deploy**
7. **COPY THE NEW URL** - it will be different!

### Step 5: Update app.js with New URL

1. Open `app.js` in your local project
2. Find line 16 (the `API_URL`)
3. Replace the URL with your **NEW deployment URL** from Step 4
4. Save the file

### Step 6: Push to GitHub

```bash
git add app.js
git commit -m "Update Apps Script URL - CORS fix"
git push
```

Cloudflare Pages will automatically redeploy.

## Alternative: If setHeaders() Doesn't Work

If `setHeaders()` is not available, Apps Script might handle CORS differently. Try this:

### Update doOptions() to use HtmlService:

```javascript
function doOptions(e){
  return HtmlService.createHtmlOutput('')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
```

### Update respond_() to use HtmlService:

```javascript
function respond_(obj){
  var htmlOutput = HtmlService.createHtmlOutput(JSON.stringify(obj));
  htmlOutput.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  htmlOutput.setMimeType(ContentService.MimeType.JSON);
  return htmlOutput;
}
```

Then **create a new deployment** again.

## Quick Test

After creating new deployment:

1. Test OPTIONS request:
   ```bash
   curl -X OPTIONS https://your-apps-script-url/exec -v
   ```
   Should see `Access-Control-Allow-Origin: *` in headers

2. Test on Cloudflare Pages
   - Should work now!

## Why This Happens

- Apps Script deployments sometimes don't properly initialize CORS
- Creating a new deployment forces Apps Script to properly configure CORS
- The `doOptions()` function must exist and be properly deployed

## Current Deployment URL

Your current URL (that's not working):
`https://script.google.com/macros/s/AKfycbzSl4REI2WDdc4RvGiSNeoxNM6hbFMWx4qXwpHwDS2v60FolqlKdGetUhUefK1dX-DrcQ/exec`

**After Step 4, you'll get a NEW URL - use that one!**

