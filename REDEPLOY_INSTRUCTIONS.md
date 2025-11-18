# How to Redeploy Apps Script Web App

## Quick Answer
**You can update the existing deployment - no need to create a new version!**

## Step-by-Step Redeployment

### 1. First, Copy Code.gs to Apps Script

1. **In your local Code.gs file** (the one you have open):
   - Select All: `Ctrl+A`
   - Copy: `Ctrl+C`

2. **Go to Apps Script**:
   - Open https://script.google.com
   - Open your "Last Resort" project
   - Click on **Code.gs** in the left sidebar
   - Select All: `Ctrl+A`
   - Paste: `Ctrl+V` (this replaces the old code)
   - **Save**: Click the floppy disk icon or press `Ctrl+S`

### 2. Redeploy (Update Existing Deployment)

1. In Apps Script, click **Deploy** → **Manage deployments**
2. You'll see your existing deployment with a **pencil icon (✏️)** next to it
3. Click the **pencil icon** to edit
4. In the popup that appears:
   - **Version**: Leave it as "New version" (or select the latest version)
   - **Description**: Optional - you can add "Added CORS support" or leave blank
   - **Execute as**: Should be "Me"
   - **Who has access**: Should be "Anyone"
5. Click **Deploy**
6. If prompted to authorize, click **Authorize access**
7. Done! The deployment URL stays the same, but now uses the updated code

### 3. Test

1. Go to `http://localhost:8080`
2. **Hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Try logging in
4. Check browser console (F12) - CORS errors should be gone!

## Important Notes

- ✅ **You can update the existing deployment** - no need to create a new one
- ✅ **The deployment URL stays the same** - your `app.js` doesn't need changes
- ✅ **Changes take effect immediately** after redeployment
- ⚠️ **You MUST redeploy** - just saving Code.gs isn't enough!

## What Changed in Code.gs?

The new Code.gs adds:
- `setCorsHeaders_()` function - adds CORS headers to responses
- `doOptions()` function - handles CORS preflight requests
- Updated `respond_()` function - uses CORS headers

These changes allow your local frontend (`localhost:8080`) to make API calls to the Apps Script backend.

## Troubleshooting

**If CORS errors persist after redeploying:**
1. Make sure you saved Code.gs in Apps Script (not just locally)
2. Make sure you clicked "Deploy" (not just "Save")
3. Wait 10-30 seconds for changes to propagate
4. Hard refresh browser (Ctrl+Shift+R)
5. Try incognito/private mode to rule out cache issues

