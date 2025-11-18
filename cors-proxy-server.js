/**
 * Simple CORS Proxy Server for Local Development
 * Handles Apps Script redirects properly
 * 
 * Usage: node cors-proxy-server.js
 * Then update app.js to use: http://localhost:3000/proxy?url=...
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse the target URL from query string
  const parsedUrl = url.parse(req.url, true);
  const targetUrl = parsedUrl.query.url;

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing url parameter' }));
    return;
  }

  // Parse target URL
  const target = url.parse(targetUrl);
  const isHttps = target.protocol === 'https:';
  const httpModule = isHttps ? https : http;

  // Read request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    // Convert body to buffer for redirect handling
    const bodyBuffer = Buffer.from(body);
    
    // Function to make request (handles redirects recursively)
    const makeRequest = (targetUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Too many redirects' }));
        return;
      }

      const parsed = url.parse(targetUrl);
      const isHttps = parsed.protocol === 'https:';
      const httpModule = isHttps ? https : http;

      const options = {
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: parsed.path,
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json'
        }
      };

      if (bodyBuffer.length > 0) {
        options.headers['Content-Length'] = bodyBuffer.length;
      }

      const proxyReq = httpModule.request(options, (proxyRes) => {
        // Handle redirects
        if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
          // Follow redirect
          const redirectUrl = proxyRes.headers.location;
          makeRequest(redirectUrl, redirectCount + 1);
          return;
        }

        // No redirect, send response
        res.writeHead(proxyRes.statusCode, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': proxyRes.headers['content-type'] || 'application/json'
        });
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });

      // Send request body if present
      if (bodyBuffer.length > 0) {
        proxyReq.write(bodyBuffer);
      }
      proxyReq.end();
    };

    // Start the request
    makeRequest(targetUrl);
  });
});

server.listen(PORT, () => {
  console.log(`CORS Proxy Server running on http://localhost:${PORT}`);
  console.log(`Usage: http://localhost:${PORT}/proxy?url=<encoded-url>`);
});

