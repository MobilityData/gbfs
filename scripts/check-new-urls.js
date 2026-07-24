#!/usr/bin/env node
'use strict';
//
// Check that URLs *newly added* in this PR return an HTTP status in the 200-299 range.
//
// "Newly added" = a URL value present in the head systems.csv that was not present
// anywhere in the base systems.csv. This deliberately ignores pre-existing URLs so a
// PR is never failed for a dead link it did not introduce.
//
// Both URL columns are checked: "URL" (operator homepage) and "Auto-Discovery URL"
// (the GBFS feed). Redirects are followed; the FINAL status must be 2xx.
//
// Usage: node scripts/check-new-urls.js <baseCsv> <headCsv>
//   baseCsv : systems.csv from the PR base (may be empty/absent if the file is new)
//   headCsv : systems.csv from the PR head (default: systems.csv)
//
const fs = require('fs');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const baseFile = process.argv[2] || '';
const headFile = process.argv[3] || 'systems.csv';

const URL_COLUMNS = ['URL', 'Auto-Discovery URL'];
const TIMEOUT_MS = 20000;
const MAX_REDIRECTS = 5;
const CONCURRENCY = 6;
const USER_AGENT =
  'Mozilla/5.0 (compatible; gbfs.org-ci/1.0; +https://github.com/MobilityData/gbfs)';

// --- CSV parsing (same shape as validate-systems-csv.js) -------------------
function parseCSV(text) {
  const records = [];
  let field = '';
  let fields = [];
  let inQuotes = false;
  let i = 0;
  let hasContent = false;

  const pushField = () => { fields.push(field); field = ''; };
  const pushRecord = () => { records.push(fields); fields = []; hasContent = false; };

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; hasContent = true; i++; continue; }
    if (c === ',') { pushField(); i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { pushField(); pushRecord(); i++; continue; }
    field += c; hasContent = true; i++;
  }
  if (hasContent || field.length > 0 || fields.length > 0) { pushField(); pushRecord(); }
  return records;
}

// Return the set of URL values (from URL_COLUMNS) found in a CSV string.
function urlsFrom(text) {
  const urls = new Set();
  if (!text || !text.trim()) return urls;
  const records = parseCSV(text);
  if (records.length === 0) return urls;
  const header = records[0];
  const idx = URL_COLUMNS.map((name) => header.indexOf(name)).filter((i) => i >= 0);
  for (let r = 1; r < records.length; r++) {
    const row = records[r];
    for (const c of idx) {
      const v = (row[c] || '').trim();
      if (v) urls.add(v);
    }
  }
  return urls;
}

// --- HTTP check ------------------------------------------------------------
// Resolve one URL, following redirects, resolving to { url, status, ok, error }.
function checkOnce(rawUrl, redirectsLeft) {
  return new Promise((resolve) => {
    let target;
    try {
      target = new URL(rawUrl);
    } catch (e) {
      resolve({ url: rawUrl, status: null, ok: false, error: `invalid URL: ${e.message}` });
      return;
    }
    if (target.protocol !== 'http:' && target.protocol !== 'https:') {
      resolve({ url: rawUrl, status: null, ok: false, error: `unsupported protocol: ${target.protocol}` });
      return;
    }

    const lib = target.protocol === 'https:' ? https : http;
    const req = lib.request(
      target,
      {
        method: 'GET',
        headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
        timeout: TIMEOUT_MS,
      },
      (res) => {
        const status = res.statusCode;
        // Follow redirects to a final status.
        if (status >= 300 && status < 400 && res.headers.location && redirectsLeft > 0) {
          res.resume(); // discard body
          let next;
          try {
            next = new URL(res.headers.location, target).toString();
          } catch (e) {
            resolve({ url: rawUrl, status, ok: false, error: `bad redirect target: ${res.headers.location}` });
            return;
          }
          resolve(checkOnce(next, redirectsLeft - 1));
          return;
        }
        res.resume(); // drain so the socket can be freed
        resolve({ url: rawUrl, status, ok: status >= 200 && status <= 299, error: null });
      }
    );

    req.on('timeout', () => { req.destroy(new Error(`timeout after ${TIMEOUT_MS}ms`)); });
    req.on('error', (e) => {
      resolve({ url: rawUrl, status: null, ok: false, error: e.message });
    });
    req.end();
  });
}

// Check a URL with one retry on transient failure (network error / timeout).
async function checkUrl(rawUrl) {
  let result = await checkOnce(rawUrl, MAX_REDIRECTS);
  if (!result.ok && result.status === null) {
    result = await checkOnce(rawUrl, MAX_REDIRECTS);
  }
  return result;
}

async function runPool(items, worker, size) {
  const results = new Array(items.length);
  let next = 0;
  async function drain() {
    while (next < items.length) {
      const cur = next++;
      results[cur] = await worker(items[cur]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, drain));
  return results;
}

async function main() {
  const headText = fs.readFileSync(headFile, 'utf8');
  let baseText = '';
  if (baseFile && fs.existsSync(baseFile)) {
    baseText = fs.readFileSync(baseFile, 'utf8');
  }

  const baseUrls = urlsFrom(baseText);
  const headUrls = urlsFrom(headText);
  const newUrls = [...headUrls].filter((u) => !baseUrls.has(u)).sort();

  if (newUrls.length === 0) {
    console.log('No newly added URLs to check.');
    process.exit(0);
  }

  console.log(`Checking ${newUrls.length} newly added URL(s) for HTTP 200-299...\n`);
  const results = await runPool(newUrls, checkUrl, CONCURRENCY);

  const failed = [];
  for (const r of results) {
    if (r.ok) {
      console.log(`  ok   ${r.status}  ${r.url}`);
    } else {
      failed.push(r);
      const detail = r.status !== null ? `HTTP ${r.status}` : r.error;
      console.log(`  FAIL ${detail}  ${r.url}`);
    }
  }

  if (failed.length > 0) {
    console.log('');
    for (const r of failed) {
      const detail = r.status !== null ? `returned HTTP ${r.status}` : `error: ${r.error}`;
      console.log(`::error::New URL ${detail}: ${r.url}`);
    }
    console.log(`\n${failed.length} of ${newUrls.length} new URL(s) did not return 200-299.`);
    process.exit(1);
  }

  console.log(`\nAll ${newUrls.length} new URL(s) returned 200-299.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(`::error::check-new-urls.js failed: ${e.stack || e.message}`);
  process.exit(2);
});
