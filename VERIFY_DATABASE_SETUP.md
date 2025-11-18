# Verify Database Setup - Quick Checklist

## Your Database

**Spreadsheet ID**: `1CqwTqj08fbHOiIcmTgOslwQ6pThnzLW0YK5zDTxfZxA`
**URL**: https://docs.google.com/spreadsheets/d/1CqwTqj08fbHOiIcmTgOslwQ6pThnzLW0YK5zDTxfZxA/edit

## ✅ Quick Verification Steps

### 1. Apps Script Must Be Bound to This Spreadsheet

**Option A: Check from Spreadsheet**
1. Open your spreadsheet: https://docs.google.com/spreadsheets/d/1CqwTqj08fbHOiIcmTgOslwQ6pThnzLW0YK5zDTxfZxA/edit
2. Go to **Extensions → Apps Script**
3. If `Code.gs` opens, it's bound ✅
4. If it says "No script found", you need to bind it

**Option B: Check from Apps Script**
1. Go to https://script.google.com
2. Open your "Last Resort" project
3. Look at the top - you should see the spreadsheet name/ID
4. If not, the script isn't bound to the spreadsheet

### 2. Verify Sheet Names

Your spreadsheet **must have** these exact sheet names:
- ✅ **"Users"** (case-sensitive, with capital U)
- ✅ **"resorts"** (lowercase r)

To check:
1. Open your spreadsheet
2. Look at the bottom tabs
3. Verify both sheets exist with exact names

### 3. Verify Sheet Structure

#### Users Sheet (should have these columns):
- Column A: FirstName
- Column B: LastName
- Column C: Email
- Column D: Password (hashed)
- Column E: VisitedResorts (JSON array)
- Column F: HomeCity
- Column G: AvatarUrl
- Column H: LastUpdated
- Column I: Method
- Column J: FavouriteResort

#### Resorts Sheet (should have these columns):
- Column A: Continent
- Column B: Country
- Column C: Name
- Column D: Gmaps
- Column E: Lat
- Column F: Lon

### 4. Test the Connection

1. In Apps Script, click **Run** → Select `getResorts_`
2. Click **Run** (▶️)
3. Authorize if prompted
4. Check the execution log - should return resort data

## If Apps Script is NOT Bound

### Bind It Now:

1. **Open your spreadsheet**
2. Go to **Extensions → Apps Script**
3. If it opens a new script, **delete the default code**
4. **Copy and paste** your `Code.gs` file content
5. **Save** (Ctrl+S)
6. The script is now bound to this spreadsheet ✅

## Current Status

Based on your spreadsheet, I can see you have:
- ✅ Users data (Kimber, Siona, Adam, Olly, Benny, Nemanja)
- ✅ VisitedResorts data
- ✅ Sheet structure looks correct

**The Apps Script just needs to be bound to this spreadsheet!**

## After Binding

1. **Redeploy** the Apps Script:
   - Deploy → Manage deployments
   - Edit existing or create new
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy

2. **Test** on Cloudflare Pages once deployed

## Quick Test

Once bound and deployed, test with:
- Your Cloudflare Pages URL
- Try logging in with: `kimbersykes87@gmail.com`
- Should work if everything is connected!

