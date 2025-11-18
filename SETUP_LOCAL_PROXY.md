# Setup Local CORS Proxy

## The Problem

- Direct Apps Script URL: Blocked by CORS
- Public CORS proxies: Fail with Apps Script redirects (502 errors)

## The Solution

Run a local CORS proxy server that properly handles Apps Script redirects.

## Setup Steps

### 1. Start the CORS Proxy Server

Open a **new terminal window** and run:

```bash
npm run proxy
```

You should see:
```
CORS Proxy Server running on http://localhost:3000
```

**Keep this terminal open** - the proxy needs to keep running.

### 2. Start the Development Server

In your **original terminal**, start the dev server:

```bash
npm run dev
```

### 3. Test

1. Open `http://localhost:8080/test-api.html`
2. Click "Test Get Resorts" - should work now!
3. Try logging in at `http://localhost:8080`

## How It Works

- The local proxy runs on `http://localhost:3000`
- It properly handles Apps Script redirects
- It adds CORS headers to all responses
- Your app automatically uses it when running on localhost

## Troubleshooting

### Port 3000 Already in Use

If you get an error about port 3000 being in use:

1. Edit `cors-proxy-server.js`
2. Change `const PORT = 3000;` to a different port (e.g., `3001`)
3. Update `app.js` to use the new port in the proxy URL

### Proxy Not Working

1. Make sure the proxy server is running (`npm run proxy`)
2. Check that port 3000 is accessible
3. Check browser console for errors
4. Verify the proxy URL in `app.js` matches the port

## Production

When you deploy to Cloudflare Pages:
- The code automatically uses the direct Apps Script URL
- No proxy needed (HTTPS origins work better with Apps Script CORS)
- No code changes required

