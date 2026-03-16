#!/usr/bin/env node
/**
 * Set the Render service start command to "node dist/src/server.js".
 * Run from repo root:
 *   RENDER_API_KEY=xxx RENDER_SERVICE_ID=srv-xxx node scripts/render-set-start-command.js
 *
 * Get API key: https://dashboard.render.com/u/settings#api-keys
 * Get Service ID: Render Dashboard → your service → URL has .../services/srv-XXXXX
 */

const https = require('https');

const apiKey = process.env.RENDER_API_KEY;
const serviceId = process.env.RENDER_SERVICE_ID;

if (!apiKey || !serviceId) {
  console.error('Usage: RENDER_API_KEY=xxx RENDER_SERVICE_ID=srv-xxx node scripts/render-set-start-command.js');
  process.exit(1);
}

const body = JSON.stringify({ startCommand: 'node dist/src/server.js' });

const opts = {
  hostname: 'api.render.com',
  path: `/v1/services/${serviceId}`,
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
};

const req = https.request(opts, (res) => {
  let data = '';
  res.on('data', (ch) => { data += ch; });
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('Start command updated to: node dist/src/server.js');
      console.log('Trigger a new deploy on Render for it to take effect.');
    } else {
      console.error('Render API error:', res.statusCode, data);
      process.exit(1);
    }
  });
});
req.on('error', (e) => {
  console.error(e);
  process.exit(1);
});
req.write(body);
req.end();
