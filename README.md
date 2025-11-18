# Last Resort - Ski Resort Tracker

A web application for tracking visited ski resorts, built with vanilla JavaScript and deployed on Cloudflare Pages, with a Google Apps Script backend.

## Project Structure

```
.
├── index.html          # Main HTML file
├── app.js              # Frontend JavaScript (replaces google.script.run)
├── package.json        # Node.js dependencies for local dev
├── _redirects          # Cloudflare Pages routing
├── wrangler.toml       # Cloudflare Pages config (optional)
└── README.md           # This file
```

## Setup

### Prerequisites

- Node.js (for local development)
- A Google Apps Script web app deployment (backend)
- A Cloudflare account (for deployment)

### Local Development

1. **Install dependencies** (optional - only needed for local server):
   ```bash
   npm install
   ```

2. **Start local development server**:
   ```bash
   npm run dev
   ```
   This will start a local server at `http://localhost:8080` and open it in your browser.

3. **Update API URL** (if needed):
   - Open `app.js`
   - Find the `CONSTANTS.API_URL` variable
   - Update it with your Apps Script web app URL if different from the default

### Apps Script Backend Setup

Your Apps Script backend needs to handle CORS properly. Make sure your `Code.gs` includes CORS headers in the response. The current implementation should work, but if you encounter CORS issues, you may need to add:

```javascript
function respond_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
```

Also ensure your Apps Script web app is deployed with:
- **Execute as**: Me
- **Who has access**: Anyone

## Deployment to Cloudflare Pages

### Option 1: Via Cloudflare Dashboard

1. **Prepare your repository**:
   - Push your code to GitHub, GitLab, or Bitbucket
   - Make sure all files are committed

2. **Deploy to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Connect your Git repository
   - Configure build settings:
     - **Build command**: (leave empty - this is a static site)
     - **Build output directory**: `/` (root)
   - Click **Save and Deploy**

3. **Configure custom domain** (optional):
   - In your Pages project settings, go to **Custom domains**
   - Add your domain

### Option 2: Via Wrangler CLI

1. **Install Wrangler**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Deploy**:
   ```bash
   wrangler pages deploy .
   ```

### Option 3: Via Git Integration

1. **Connect repository**:
   - In Cloudflare Dashboard → Pages → Create a project
   - Select your Git provider and repository
   - Cloudflare will automatically deploy on every push to your main branch

## Configuration

### Environment Variables (if needed)

If you need different API URLs for different environments, you can:

1. Create a `config.js` file:
   ```javascript
   window.APP_CONFIG = {
     API_URL: 'https://your-apps-script-url/exec'
   };
   ```

2. Include it in `index.html` before `app.js`:
   ```html
   <script src="config.js"></script>
   <script src="app.js"></script>
   ```

3. Update `app.js` to use the config:
   ```javascript
   var CONSTANTS = {
     API_URL: window.APP_CONFIG?.API_URL || 'https://script.google.com/macros/s/.../exec'
   };
   ```

## Troubleshooting

### CORS Errors

If you encounter CORS errors:

1. **Check Apps Script deployment**:
   - Ensure the web app is deployed with "Anyone" access
   - Verify the deployment URL is correct

2. **Check browser console**:
   - Look for specific error messages
   - Verify the API URL is correct

3. **Test API directly**:
   ```bash
   curl -X POST https://your-apps-script-url/exec \
     -H "Content-Type: application/json" \
     -d '{"action":"getResorts"}'
   ```

### Build Issues

- Ensure `_redirects` file is in the root directory
- Check that all paths in `index.html` are relative
- Verify no absolute paths that might break in production

## Development Workflow

1. **Make changes locally**:
   - Edit `index.html` or `app.js`
   - Test with `npm run dev`

2. **Test thoroughly**:
   - Test all features (login, signup, resort updates, etc.)
   - Check browser console for errors

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

4. **Cloudflare Pages will auto-deploy** (if using Git integration)

## File Structure Details

- **index.html**: Contains all HTML structure and inline styles
- **app.js**: Contains all JavaScript logic, API calls, and UI interactions
- **_redirects**: Ensures all routes serve `index.html` (for SPA routing if needed)
- **package.json**: Minimal config for local development server

## Notes

- The app uses localStorage for user session persistence
- All API calls go to your Google Apps Script web app
- The frontend is completely static and can be served from any CDN
- No build process required - just deploy the files as-is

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify your Apps Script deployment is working
3. Ensure all URLs are correct in `app.js`

