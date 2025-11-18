# CORS Issue Explanation

## The Problem

Google Apps Script web apps have a **known limitation** where CORS preflight (OPTIONS) requests don't always work correctly, especially from:
- `http://localhost` (non-HTTPS origins)
- Local development environments

Even though your `Code.gs` has the `doOptions()` function with proper CORS headers, Apps Script may not call it or may not return the headers correctly for localhost requests.

## The Solution

We use a **CORS proxy for localhost development only**. This is a common and acceptable practice for local development.

### How It Works

1. **Localhost (Development)**: 
   - Uses `https://corsproxy.io/?[your-apps-script-url]`
   - The proxy adds CORS headers and forwards the request
   - This allows local development to work

2. **Production (Cloudflare Pages)**:
   - Uses direct Apps Script URL
   - Cloudflare Pages serves over HTTPS
   - Apps Script CORS works better with HTTPS origins
   - No proxy needed

### Why This Is Safe

- **Development only**: The proxy is only used on localhost
- **Production**: Direct connection, no third-party proxy
- **Common practice**: Many developers use CORS proxies for local development
- **Temporary**: Once deployed to Cloudflare Pages, the proxy won't be used

## Alternative Solutions (If Needed)

### Option 1: Use a Local CORS Proxy
If `corsproxy.io` has rate limits or issues, you can run your own:

```bash
npm install -g cors-anywhere
cors-anywhere
```

Then update `app.js` to use `http://localhost:8080` as the proxy.

### Option 2: Deploy to Cloudflare Pages First
Since Cloudflare Pages uses HTTPS, CORS should work better. You can:
1. Deploy to Cloudflare Pages
2. Test there
3. Use direct URL (no proxy needed)

### Option 3: Use Apps Script API Executable (Advanced)
Deploy as an API executable instead of web app, but this requires different authentication setup.

## Current Configuration

The code automatically detects the environment:

```javascript
API_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'https://corsproxy.io/?https://script.google.com/.../exec'  // Local dev
  : 'https://script.google.com/.../exec'                        // Production
```

This ensures:
- ✅ Local development works
- ✅ Production uses direct connection
- ✅ No code changes needed when deploying

