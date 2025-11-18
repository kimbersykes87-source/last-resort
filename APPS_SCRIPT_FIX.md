# Apps Script Code Fix Required

## The Problem

The error shows:
```
TypeError: output.setMimeType(...).setHeaders is not a function (line 108, file "Code")
```

This means `setHeaders()` is not available on `TextOutput` objects in Apps Script, or it's not chainable.

## The Fix

I've updated your local `Code.gs` file, but you need to **copy these changes to your Apps Script project**.

### Step 1: Open Apps Script

1. Go to https://script.google.com
2. Open your "Last Resort" project
3. Open `Code.gs`

### Step 2: Update `setCorsHeaders_` Function

**Replace** the `setCorsHeaders_` function (around line 105) with:

```javascript
function setCorsHeaders_(output){
  // Set MIME type first
  output.setMimeType(ContentService.MimeType.JSON);
  // Set headers - setHeaders returns the output object for chaining
  output.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600'
  });
  return output;
}
```

### Step 3: Update `doOptions` Function

**Replace** the `doOptions` function (around line 136) with:

```javascript
function doOptions(e){
  var output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  output.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600'
  });
  return output;
}
```

### Step 4: If `setHeaders()` Still Doesn't Work

If you get the same error after updating, `setHeaders()` might not be available in your Apps Script version. Try this alternative approach:

**Option A: Use HtmlService instead (if setHeaders doesn't work)**

```javascript
function setCorsHeaders_(output){
  output.setMimeType(ContentService.MimeType.JSON);
  // If setHeaders doesn't work, we'll rely on deployment settings
  return output;
}

function doOptions(e){
  // Return empty response with proper MIME type
  var output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}
```

Then configure CORS at the deployment level:
1. Go to **Deploy** → **Manage deployments**
2. Edit your deployment
3. Check "Allow CORS" or similar option (if available)

**Option B: Use HtmlService with XFrameOptions**

```javascript
function respond_(obj){
  var htmlOutput = HtmlService.createHtmlOutput(JSON.stringify(obj));
  htmlOutput.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  htmlOutput.setMimeType(ContentService.MimeType.JSON);
  return htmlOutput;
}
```

### Step 5: Save and Redeploy

1. Click **Save** (Ctrl+S)
2. Go to **Deploy** → **Manage deployments**
3. Click the **pencil icon** (✏️) to edit your deployment
4. Click **Deploy** (this creates a new version)
5. **OR** create a completely new deployment

### Step 6: Test

1. Go back to your test page: `http://localhost:8080/test-api.html`
2. Click "Test Login" again
3. Check if the error is gone

## Verification

After updating, the response should be JSON, not HTML. You should see:
- Response Status: 200
- Response Body: `{"success":true,"data":{...}}` (not "Google Apps Script")

