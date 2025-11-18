# Quick Fix: CORS Errors

## The Problem
Your browser is blocking API calls because the Apps Script backend isn't sending CORS headers.

## The Solution (3 Steps)

### Step 1: Copy Code.gs to Apps Script

1. **Open the Code.gs file** in this directory (you have it open)
2. **Select All** (Ctrl+A) and **Copy** (Ctrl+C)
3. Go to https://script.google.com
4. Open your "Last Resort" Apps Script project
5. In the left sidebar, click on **Code.gs**
6. **Select All** (Ctrl+A) and **Paste** (Ctrl+V) to replace everything
7. Click **Save** (Ctrl+S) or the floppy disk icon

### Step 2: Redeploy the Web App

**This is critical - the web app must be redeployed for changes to take effect!**

1. In Apps Script, click **Deploy** → **Manage deployments**
2. You should see your existing deployment
3. Click the **pencil icon** (✏️) next to it to edit
4. Click **Deploy** (you don't need to change anything)
5. A popup may appear - click **Authorize access** if needed
6. Make sure the settings show:
   - **Execute as**: Me
   - **Who has access**: Anyone

### Step 3: Test

1. Go back to `http://localhost:8080`
2. **Hard refresh** your browser:
   - **Chrome/Edge**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - **Firefox**: Ctrl+F5
3. Open the browser console (F12)
4. Try logging in
5. CORS errors should be gone!

## Verification Checklist

After redeploying, check:
- [ ] Code.gs is saved in Apps Script
- [ ] Web app is redeployed (not just saved)
- [ ] Browser is hard refreshed (Ctrl+Shift+R)
- [ ] No CORS errors in console
- [ ] Login works

## If It Still Doesn't Work

1. **Check the deployment URL**: Make sure `app.js` has the correct URL
2. **Wait a minute**: Sometimes Apps Script takes a moment to update
3. **Clear browser cache**: Try incognito/private mode
4. **Check Apps Script logs**: 
   - In Apps Script, go to **Executions** (left sidebar)
   - See if there are any errors

## Common Mistakes

❌ **Just saving Code.gs** - You must redeploy!
❌ **Not hard refreshing** - Regular refresh might use cached version
❌ **Wrong deployment** - Make sure you're editing the right deployment

## Need Help?

If you're still seeing CORS errors after:
1. Copying the Code.gs file
2. Saving it
3. Redeploying the web app
4. Hard refreshing the browser

Then there might be an issue with the Apps Script deployment itself. Check the Apps Script execution logs for errors.

