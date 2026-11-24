import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import { startServer, stopServer } from '../../src/server.js';
import { sendRaw } from '../support/http-client.js';

describe('HTTP API', () => {
  const logLines = [];
  const errorLines = [];
  let server;
  let port;

  before(async () => {
    server = await startServer(
      { host: '127.0.0.1', port: 0 },
      {
        clock: () => new Date(2026, 0, 2, 3, 4, 5, 6),
        log: (line) => logLines.push(line),
        logError: (line) => errorLines.push(line),
      },
    );
    port = server.address().port;
  });

  after(() => stopServer(server));

  beforeEach(() => {
    logLines.length = 0;
    errorLines.length = 0;
  });

  for (const path of ['/', '/any', '/deeply/nested/path', '/with?query=1']) {
    it(`returns the timestamp for GET ${path}`, async () => {
      const response = await sendRaw(port, { path });
      assert.equal(response.status, 200);
      assert.equal(response.body, '\nRequest made at : 3:4:5:6');
      assert.match(response.headers['content-type'], /^text\/plain/);
    });
  }

  it('logs the response time', async () => {
    await sendRaw(port);
    assert.deepEqual(logLines, ['Response made at: 3:4:5:6']);
  });

  it('does not reflect the request path', async () => {
    const response = await sendRaw(port, { path: '/%3Cscript%3Ealert(1)%3C%2Fscript%3E' });
    assert.equal(response.status, 200);
    assert.doesNotMatch(response.body, /script/i);
  });

  it('answers HEAD without a body', async () => {
    const response = await sendRaw(port, { method: 'HEAD' });
    assert.equal(response.status, 200);
    assert.equal(response.body, '');
  });

  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
    it(`rejects ${method} with 405`, async () => {
      const response = await sendRaw(port, { method, path: '/any' });
      assert.equal(response.status, 405);
      assert.equal(response.headers.allow, 'GET, HEAD');
      assert.deepEqual(logLines, []);
    });
  }

  it('sends hardening headers and hides the framework', async () => {
    const { headers } = await sendRaw(port);
    assert.equal(headers['x-powered-by'], undefined);
    assert.equal(headers['x-content-type-options'], 'nosniff');
    assert.equal(headers['cache-control'], 'no-store');
    assert.equal(headers['referrer-policy'], 'no-referrer');
    assert.equal(headers['cross-origin-resource-policy'], 'same-origin');
    assert.match(headers['content-security-policy'], /default-src 'none'/);
    assert.match(headers['content-security-policy'], /frame-ancestors 'none'/);
  });

  it('answers malformed percent-encoding with a generic 400', async () => {
    const response = await sendRaw(port, { path: '/%E0%A4%A' });
    assert.equal(response.status, 400);
    assert.equal(response.body, 'Bad Request');
    assert.equal(response.headers['x-content-type-options'], 'nosniff');
    assert.deepEqual(errorLines, []);
  });

  it('answers an asterisk-form target with a generic 404', async () => {
    const response = await sendRaw(port, { path: '*' });
    assert.equal(response.status, 404);
    assert.equal(response.body, 'Not Found');
    assert.match(response.headers['content-type'], /^text\/plain/);
    assert.equal(response.headers['x-content-type-options'], 'nosniff');
  });

  for (const method of ['GET', 'HEAD']) {
    it(`ignores conditional headers on ${method}`, async () => {
      const response = await sendRaw(port, { method, headers: { 'If-None-Match': '*' } });
      assert.equal(response.status, 200);
      assert.equal(response.headers.etag, undefined);
      assert.match(response.headers['content-type'], /^text\/plain/);
    });
  }

  it('rejects startup when the port is already in use', async () => {
    await assert.rejects(
      startServer({ host: '127.0.0.1', port }, { log: () => {} }),
      { code: 'EADDRINUSE' },
    );
  });

  it('configures request timeouts', () => {
    assert.equal(server.requestTimeout, 30_000);
    assert.equal(server.headersTimeout, 10_000);
    assert.equal(server.keepAliveTimeout, 5_000);
  });
});
