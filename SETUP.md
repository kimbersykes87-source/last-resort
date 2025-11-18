# Setup Guide

Complete setup instructions for Last Resort application.

## Prerequisites

- Google account (for Apps Script and Sheets)
- Cloudflare account (for hosting)
- GitHub account (for code repository)

## Step 1: Google Sheets Database

1. **Create Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new spreadsheet
   - Name it "Last Resort Database" (or your choice)

2. **Create Required Sheets**
   - Create a sheet named **`Users`** (exact name, capital U)
   - Create a sheet named **`resorts`** (exact name, lowercase r)

3. **Set Up Users Sheet Structure**
   - Row 1 (Headers): FirstName | LastName | Email | Password | VisitedResorts | HomeCity | AvatarUrl | LastUpdated | Method | FavouriteResort
   - Leave row 1 as headers
   - Data starts from row 2

4. **Set Up Resorts Sheet Structure**
   - Row 1 (Headers): Continent | Country | Name | Gmaps | Lat | Lon
   - Leave row 1 as headers
   - Add your resort data starting from row 2

5. **Note the Spreadsheet ID**
   - From the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part

## Step 2: Google Apps Script Backend

1. **Open Apps Script**
   - In your Google Sheet: **Extensions → Apps Script**
   - This opens the Apps Script editor

2. **Copy Backend Code**
   - Open `Code.gs` from this repository
   - Copy the entire contents
   - Paste into Apps Script editor (replace default code)
   - **Save** (Ctrl+S or Cmd+S)

3. **Deploy as Web App**
   - Click **Deploy** → **New deployment**
   - Click the **gear icon** (⚙️) next to "Select type"
   - Choose **Web app**
   - Settings:
     - **Description**: "Last Resort API"
     - **Execute as**: **Me** ⚠️ (Important!)
     - **Who has access**: **Anyone** ⚠️ (Important!)
   - Click **Deploy**
   - **Authorize** if prompted (click "Review permissions" → "Allow")
   - **Copy the deployment URL** (looks like: `https://script.google.com/macros/s/.../exec`)

4. **Update Cloudflare Worker**
   - Open `functions/api-proxy.js` in this repository
   - Find the line: `const APPS_SCRIPT_URL = '...'`
   - Replace with your deployment URL from step 3
   - Save the file

## Step 3: Deploy to Cloudflare Pages

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial setup"
   git push
   ```

2. **Connect to Cloudflare**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** → **Pages**
   - Click **Create a project**
   - Click **Connect to Git**

3. **Select Repository**
   - Choose **GitHub**
   - Authorize Cloudflare
   - Select your `last-resort` repository

4. **Configure Build**
   - **Project name**: `last-resort` (or your choice)
   - **Production branch**: `main`
   - **Framework preset**: **None** ⚠️ (Important!)
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root)
   - **Root directory**: (leave empty)

5. **Deploy**
   - Click **Save and Deploy**
   - Wait 1-2 minutes for deployment
   - Your site will be live at: `https://last-resort.pages.dev`

## Step 4: Verify Setup

1. **Test the Site**
   - Visit your Cloudflare Pages URL
   - Try creating a new account
   - Try logging in

2. **Check Apps Script**
   - Verify Apps Script is bound to your Google Sheet
   - Test by running `getResorts_` function in Apps Script

3. **Check Worker Function**
   - Cloudflare Dashboard → Pages → Your project
   - Go to **Functions** tab
   - Verify `api-proxy.js` is listed

## Troubleshooting

### Apps Script Not Working

- Verify Apps Script is bound to the correct spreadsheet
- Check deployment settings: "Execute as: Me", "Who has access: Anyone"
- Verify sheet names match exactly: `Users` and `resorts`

### CORS Errors

- The Cloudflare Worker should handle this automatically
- Verify `functions/api-proxy.js` exists and is deployed
- Check that `APPS_SCRIPT_URL` in the worker is correct

### Deployment Fails

- Check build logs in Cloudflare Dashboard
- Verify all files are committed to git
- Ensure `index.html` exists in root directory

## Next Steps

Once setup is complete:
- ✅ Your app is live on Cloudflare Pages
- ✅ Users can sign up and log in
- ✅ Data is stored in Google Sheets
- ✅ Automatic deployments on every git push

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Cloudflare Pages build logs
3. Verify Apps Script execution logs
4. Ensure all setup steps were completed

