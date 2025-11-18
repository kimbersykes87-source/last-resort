# Apps Script Database Setup

## Your Google Sheets Database

Your database is located at:
**https://docs.google.com/spreadsheets/d/1CqwTqj08fbHOiIcmTgOslwQ6pThnzLW0YK5zDTxfZxA/edit**

## Verify Apps Script is Connected

Your Apps Script backend **must be bound to this spreadsheet**. Here's how to verify and set it up:

### Step 1: Open Apps Script Project

1. Go to https://script.google.com
2. Find your "Last Resort" project (or the one with the deployment URL ending in `AKfycbzSl4REI2WDdc4RvGiSNeoxNM6hbFMWx4qXwpHwDS2v60FolqlKdGetUhUefK1dX-DrcQ`)
3. Open the project

### Step 2: Verify Spreadsheet Connection

**Option A: Check if Already Bound**

1. In Apps Script, look at the top of the editor
2. You should see the spreadsheet name or ID
3. If you see it, the script is already bound ✅

**Option B: Bind to Spreadsheet (if not bound)**

1. In Apps Script, click the **"+" icon** next to "Files"
2. Select **"Spreadsheet"**
3. Enter the spreadsheet ID: `1CqwTqj08fbHOiIcmTgOslwQ6pThnzLW0YK5zDTxfZxA`
4. Or open the spreadsheet and go to **Extensions → Apps Script**

### Step 3: Verify Sheet Names

Your `Code.gs` expects these sheet names:
- **`Users`** - Contains user data (FirstName, LastName, Email, Password, etc.)
- **`resorts`** - Contains resort data (Continent, Country, Name, Gmaps, Lat, Lon)

Make sure your Google Sheets file has:
- A sheet named exactly **"Users"** (case-sensitive)
- A sheet named exactly **"resorts"** (case-sensitive)

### Step 4: Verify Sheet Structure

#### Users Sheet Structure (Columns A-J):
1. **A**: FirstName
2. **B**: LastName  
3. **C**: Email
4. **D**: Password (hashed)
5. **E**: VisitedResorts (JSON array)
6. **F**: HomeCity
7. **G**: AvatarUrl (unused)
8. **H**: LastUpdated
9. **I**: Method (Snowboard/Ski)
10. **J**: FavouriteResort

#### Resorts Sheet Structure (Columns A-F):
1. **A**: Continent
2. **B**: Country
3. **C**: Name
4. **D**: Gmaps
5. **E**: Lat (latitude)
6. **F**: Lon (longitude)

### Step 5: Test the Connection

1. In Apps Script, click **Run** → Select `getResorts_` function
2. Click the **Run** button (▶️)
3. Authorize if prompted
4. Check the execution log - it should return resort data

### Step 6: Redeploy if Needed

If you made changes to the spreadsheet binding:

1. Go to **Deploy** → **Manage deployments**
2. Click the **pencil icon** (✏️) to edit
3. Click **Deploy** (creates new version)
4. **Copy the new URL** if it changed
5. Update `app.js` with the new URL if needed

## Current Status

Based on your spreadsheet URL, the ID is: `1CqwTqj08fbHOiIcmTgOslwQ6pThnzLW0YK5zDTxfZxA`

Your Apps Script deployment URL is:
`https://script.google.com/macros/s/AKfycbzSl4REI2WDdc4RvGiSNeoxNM6hbFMWx4qXwpHwDS2v60FolqlKdGetUhUefK1dX-DrcQ/exec`

## Troubleshooting

### "Sheet not found" errors

- Verify sheet names match exactly: `Users` and `resorts`
- Check that sheets exist in the spreadsheet
- Ensure Apps Script has access to the spreadsheet

### "Permission denied" errors

- Make sure Apps Script is bound to the correct spreadsheet
- Check that the deployment has "Execute as: Me" and "Who has access: Anyone"

### Data not loading

- Verify the sheet structure matches the expected columns
- Check that data starts from row 2 (row 1 should be headers)
- Ensure Apps Script has edit access to the spreadsheet

## Quick Check

To quickly verify everything is connected:

1. Open your spreadsheet
2. Go to **Extensions → Apps Script**
3. If your `Code.gs` opens, it's bound ✅
4. If not, you need to bind it (see Step 2 above)

