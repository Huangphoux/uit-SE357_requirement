#!/usr/bin/env node

/**
 * ASR-PERF-01 Benchmark Script
 * 
 * Tests the API's ability to handle 500 concurrent users
 * Target: 500 simultaneous requests to /api/health endpoint
 * 
 * Usage:
 *   node benchmark-asr-perf-01.js
 * 
 * Requirements:
 *   - Backend running on localhost:8000
 *   - Node.js built-in modules (http, perf_hooks, fs, path)
 * 
 * Output:
 *   - Prints results to console as JSON
 *   - Saves results to docs/asr-perf-01-results.csv
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

const TOTAL_REQUESTS = 500;
const API_HOST = process.env.API_HOST || '127.0.0.1';
const API_PORT = process.env.API_PORT || 8000;
const API_PATH = process.env.API_PATH || '/api/health';

const agent = new http.Agent({
  keepAlive: false,
  maxSockets: TOTAL_REQUESTS
});

function requestOnce(index) {
  return new Promise((resolve) => {
    // Unique X-Forwarded-For per request to bypass rate limiter
    const ip = `10.0.${Math.floor(index / 250)}.${(index % 250) + 1}`;
    const started = performance.now();

    const req = http.request({
      hostname: API_HOST,
      port: API_PORT,
      path: API_PATH,
      method: 'GET',
      agent,
      headers: {
        'X-Forwarded-For': ip,
        'Accept': 'application/json',
      },
    }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({
          ok: res.statusCode === 200,
          statusCode: res.statusCode,
          ms: performance.now() - started,
          body,
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        ok: false,
        statusCode: 0,
        ms: performance.now() - started,
        error: error.message
      });
    });

    req.end();
  });
}

(async () => {
  console.log(`Starting benchmark: ${TOTAL_REQUESTS} concurrent requests to ${API_HOST}:${API_PORT}${API_PATH}`);
  console.log('---');

  const started = performance.now();
  const results = await Promise.all(
    Array.from({ length: TOTAL_REQUESTS }, (_, index) => requestOnce(index))
  );
  const elapsed = performance.now() - started;

  // Calculate statistics
  const latencies = results
    .filter((result) => result.ok)
    .map((result) => result.ms)
    .sort((left, right) => left - right);

  const successCount = results.filter((result) => result.ok).length;
  const failureCount = TOTAL_REQUESTS - successCount;
  const average = latencies.reduce((sum, value) => sum + value, 0) / Math.max(latencies.length, 1);

  const percentile = (values, p) => {
    if (!values.length) return 0;
    return values[Math.min(values.length - 1, Math.ceil(values.length * p) - 1)];
  };

  const output = {
    total: TOTAL_REQUESTS,
    successCount,
    failureCount,
    successRate: (successCount / TOTAL_REQUESTS * 100).toFixed(2) + '%',
    totalElapsedMs: elapsed.toFixed(2),
    averageResponseMs: average.toFixed(2),
    p95ResponseMs: percentile(latencies, 0.95).toFixed(2),
    p99ResponseMs: percentile(latencies, 0.99).toFixed(2),
    maxResponseMs: latencies.length ? latencies[latencies.length - 1].toFixed(2) : '0',
    sampleStatuses: results.slice(0, 10).map((result) => result.statusCode),
  };

  // Print to console
  console.log(JSON.stringify(output, null, 2));

  // Save to CSV file
  const csvPath = path.join(__dirname, 'docs', 'asr-perf-01-results.csv');
  const csvContent = `metric,value,unit
total_requests,${TOTAL_REQUESTS},count
successful_requests,${successCount},count
failed_requests,${failureCount},count
success_rate,${output.successRate},%
average_response_ms,${output.averageResponseMs},milliseconds
p95_response_ms,${output.p95ResponseMs},milliseconds
p99_response_ms,${output.p99ResponseMs},milliseconds
max_response_ms,${output.maxResponseMs},milliseconds
total_elapsed_ms,${output.totalElapsedMs},milliseconds
endpoint,${API_PATH},text
concurrency_level,${TOTAL_REQUESTS},concurrent_users
test_date,${new Date().toISOString().split('T')[0]},ISO8601
server_port,${API_PORT},integer
database,PostgreSQL,text
cache_layer,Redis,text`;

  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`\nResults saved to: ${csvPath}`);
})();
