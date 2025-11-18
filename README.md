# Last Resort - Ski Resort Tracker

A web application for tracking visited ski resorts around the world. Built with vanilla JavaScript, deployed on Cloudflare Pages, with a Google Apps Script backend and Google Sheets database.

## 🎯 Features

- **User Authentication** - Email/password login and signup
- **Resort Tracking** - Track which ski resorts you've visited
- **Interactive Maps** - Visualize your visited resorts on Leaflet maps
- **Leaderboards** - See who's visited the most resorts, countries, and continents
- **User Directory** - Browse other users and their resort collections
- **Profile Management** - Update your profile, favorite resort, and skiing method

## 🏗️ Architecture

- **Frontend**: Vanilla JavaScript, Tailwind CSS, Leaflet maps
- **Backend**: Google Apps Script (API)
- **Database**: Google Sheets
- **Hosting**: Cloudflare Pages
- **CORS Proxy**: Cloudflare Worker function

## 📁 Project Structure

```
.
├── index.html              # Main HTML file
├── app.js                  # Frontend JavaScript
├── functions/
│   └── api-proxy.js        # Cloudflare Worker (CORS proxy)
├── package.json            # Node.js dependencies
├── wrangler.toml          # Cloudflare configuration
├── _redirects              # Cloudflare Pages routing
├── .gitignore             # Git ignore rules
├── Icons/                 # App icons
├── Backgrounds/           # Background images
└── Code.gs                # Apps Script backend (reference only)
```

## 🚀 Quick Start

### Prerequisites

- Node.js (for local development)
- Google account (for Apps Script and Sheets)
- Cloudflare account (for deployment)
- Git (for version control)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/kimbersykes87-source/last-resort.git
   cd last-resort
   ```

2. **Install dependencies** (optional - only for local server)
   ```bash
   npm install
   ```

3. **Start local development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:8080`

### Production Deployment

The app is automatically deployed to Cloudflare Pages on every git push to `main`.

**Manual deployment:**
1. Push code to GitHub
2. Cloudflare Pages automatically builds and deploys
3. Your site is live at `https://last-resort.pages.dev`

## 🔧 Setup Instructions

### 1. Google Apps Script Backend

1. **Create/Open Google Sheets**
   - Create a new Google Sheet or use existing one
   - Must have two sheets: `Users` and `resorts`
   - See `Code.gs` for required sheet structure

2. **Create Apps Script**
   - In Google Sheets: **Extensions → Apps Script**
   - Copy contents of `Code.gs` into the editor
   - Save the project

3. **Deploy as Web App**
   - **Deploy** → **New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
   - **Copy the deployment URL**

4. **Update Worker Function**
   - Open `functions/api-proxy.js`
   - Replace `APPS_SCRIPT_URL` with your deployment URL
   - Commit and push to GitHub

### 2. Google Sheets Database Structure

#### Users Sheet (Columns A-J):
- **A**: FirstName
- **B**: LastName
- **C**: Email
- **D**: Password (hashed - SHA-256)
- **E**: VisitedResorts (JSON array)
- **F**: HomeCity
- **G**: AvatarUrl (unused)
- **H**: LastUpdated (ISO timestamp)
- **I**: Method (Snowboard/Ski)
- **J**: FavouriteResort

#### Resorts Sheet (Columns A-F):
- **A**: Continent
- **B**: Country
- **C**: Name
- **D**: Gmaps
- **E**: Lat (latitude)
- **F**: Lon (longitude)

### 3. Cloudflare Pages Setup

1. **Connect Repository**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
   - **Create a project** → **Connect to Git**
   - Select your GitHub repository

2. **Build Settings**
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root)
   - **Root directory**: (leave empty)

3. **Deploy**
   - Click **Save and Deploy**
   - Wait for deployment (1-2 minutes)
   - Your site is live!

## 🔐 How CORS Works

The app uses a **Cloudflare Worker function** (`functions/api-proxy.js`) to handle CORS:

1. Frontend makes requests to `/api-proxy` (same domain)
2. Worker adds CORS headers and proxies to Apps Script
3. Apps Script processes the request
4. Worker adds CORS headers to response
5. Frontend receives response without CORS errors

This is more reliable than relying on Apps Script's CORS implementation.

## 🎨 UI Features

- **Dark theme** with modern design
- **Loading indicator** with rotating snowflake and "Loading..." text
- **Interactive maps** using Leaflet
- **Responsive design** for mobile and desktop
- **Toast notifications** for user feedback
- **White favicon** for clean branding

## 📝 Configuration

### Update Apps Script URL

If you need to change the Apps Script URL:

1. Edit `functions/api-proxy.js`
2. Update `APPS_SCRIPT_URL` constant
3. Commit and push - Cloudflare will redeploy automatically

### Environment Variables

No environment variables needed - everything is configured in code.

## 🧪 Testing

### Local Testing

For local development, you can:
- Use Chrome with CORS disabled (development only):
  ```bash
  chrome.exe --user-data-dir="C:/ChromeDevSession" --disable-web-security
  ```
- Or deploy to Cloudflare Pages and test there

### Production Testing

1. Visit your Cloudflare Pages URL
2. Test login/signup
3. Test all features
4. Check browser console for errors

## 🐛 Troubleshooting

### CORS Errors

- ✅ **Solution**: Cloudflare Worker handles CORS automatically
- If errors persist, check `functions/api-proxy.js` is deployed

### Apps Script Errors

- Verify Apps Script is bound to your Google Sheets
- Check deployment settings: "Execute as: Me", "Who has access: Anyone"
- Verify sheet names match exactly: `Users` and `resorts`

### Deployment Issues

- Check Cloudflare Pages build logs
- Verify all files are committed to git
- Ensure `functions/api-proxy.js` exists

## 📚 Key Files

- **`index.html`** - Main HTML structure
- **`app.js`** - All frontend logic and API calls
- **`functions/api-proxy.js`** - Cloudflare Worker CORS proxy
- **`Code.gs`** - Apps Script backend (reference - copy to Apps Script)
- **`_redirects`** - SPA routing configuration

## 🔄 Deployment Workflow

1. Make changes locally
2. Test with `npm run dev`
3. Commit changes: `git add . && git commit -m "Description"`
4. Push to GitHub: `git push`
5. Cloudflare Pages automatically deploys
6. Test on production URL

## 📄 License

ISC

## 👤 Author

Kimber Sykes

## 🙏 Acknowledgments

- Tailwind CSS for styling
- Leaflet for maps
- Google Apps Script for backend
- Cloudflare for hosting

---

**Need help?** Check the browser console for errors and verify all setup steps are complete.
