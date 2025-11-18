/**
 * Cloudflare Worker Function - CORS Proxy for Apps Script
 * This handles CORS headers and proxies requests to Apps Script
 */

export async function onRequest(context) {
  const { request } = context;
  
  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
      },
    });
  }

  // Apps Script URL
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTzqWvuj5DLQseoziCo9KIb2z2vYiZM6OpuTwlAOo4UPAWbL1QI3nndu9zKye11jrXcQ/exec';

  try {
    // Get request body if present
    let body = null;
    if (request.method === 'POST') {
      body = await request.text();
    }

    // Forward request to Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
      redirect: 'follow', // Follow redirects
    });

    // Get response text
    const responseText = await response.text();

    // Return response with CORS headers
    return new Response(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

