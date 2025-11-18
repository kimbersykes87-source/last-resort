# CORS Proxy Alternatives

If the direct Apps Script URL doesn't work due to CORS, here are alternative CORS proxies you can use for localhost development:

## Option 1: AllOrigins (Recommended)
```javascript
API_URL: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://script.google.com/macros/s/AKfycbzSl4REI2WDdc4RvGiSNeoxNM6hbFMWx4qXwpHwDS2v60FolqlKdGetUhUefK1dX-DrcQ/exec')
```

## Option 2: CORS Anywhere (Public Instance)
```javascript
API_URL: 'https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbzSl4REI2WDdc4RvGiSNeoxNM6hbFMWx4qXwpHwDS2v60FolqlKdGetUhUefK1dX-DrcQ/exec'
```
Note: May require temporary access request

## Option 3: Run Your Own CORS Proxy Locally
```bash
npm install -g cors-anywhere
cors-anywhere
```
Then use: `http://localhost:8080/https://script.google.com/...`

## Option 4: Use Mode: 'no-cors' (Limited)
This won't work for POST requests with JSON body, but might work for GET:
```javascript
fetch(url, { mode: 'no-cors', ... })
```

## Current Status
The code is now set to try the direct URL first. If CORS errors occur, update `app.js` to use one of the alternatives above.

