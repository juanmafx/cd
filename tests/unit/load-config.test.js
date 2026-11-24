import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadConfig } from '../../src/config/load-config.js';

test('defaults to loopback on port 3000', () => {
  assert.deepEqual(loadConfig({}), { host: '127.0.0.1', port: 3000 });
});

test('treats an empty PORT as unset', () => {
  assert.equal(loadConfig({ PORT: '' }).port, 3000);
});

test('reads HOST and PORT from the environment', () => {
  assert.deepEqual(loadConfig({ HOST: '0.0.0.0', PORT: '8080' }), { host: '0.0.0.0', port: 8080 });
});

test('accepts the port range boundaries', () => {
  assert.equal(loadConfig({ PORT: '0' }).port, 0);
  assert.equal(loadConfig({ PORT: '65535' }).port, 65535);
});

test('treats an empty HOST as unset', () => {
  assert.equal(loadConfig({ HOST: '' }).host, '127.0.0.1');
});

for (const validHost of ['localhost', 'service.internal', '0.0.0.0', '192.168.1.10', '::', '::1']) {
  test(`accepts HOST value ${JSON.stringify(validHost)}`, () => {
    assert.equal(loadConfig({ HOST: validHost }).host, validHost);
  });
}

for (const invalidHost of ['bad host', 'host/path', '-leading.example', 'a..b', '256.1.1.1', 'x'.repeat(254)]) {
  test(`rejects invalid HOST value ${JSON.stringify(invalidHost.slice(0, 20))}`, () => {
    assert.throws(
      () => loadConfig({ HOST: invalidHost }),
      (error) => error instanceof RangeError && !error.message.includes(invalidHost),
    );
  });
}

for (const invalidPort of ['65536', '-1', '80.5', 'abc', '3000abc', ' 3000', '0x50', '1e3']) {
  test(`rejects invalid PORT value ${JSON.stringify(invalidPort)}`, () => {
    assert.throws(() => loadConfig({ PORT: invalidPort }), RangeError);
  });
}
