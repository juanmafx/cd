import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { sendRaw } from '../support/http-client.js';

const entryPoint = fileURLToPath(new URL('../../src/main.js', import.meta.url));

const waitForPort = (child) =>
  new Promise((resolve, reject) => {
    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk;
      const match = output.match(/Listening on 127\.0\.0\.1:(\d+)/);
      if (match) resolve(Number(match[1]));
    });
    child.once('exit', () => reject(new Error('process exited before listening')));
  });

for (const signal of ['SIGTERM', 'SIGINT']) {
  test(`serves requests and exits cleanly on ${signal}`, async () => {
    const child = spawn(process.execPath, [entryPoint], {
      env: { PATH: process.env.PATH, PORT: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const port = await waitForPort(child);
    const response = await sendRaw(port);
    assert.equal(response.status, 200);
    assert.match(response.body, /^\nRequest made at : \d+:\d+:\d+:\d+$/);
    const exited = once(child, 'exit');
    child.kill(signal);
    const [code, receivedSignal] = await exited;
    assert.equal(code, 0);
    assert.equal(receivedSignal, null);
  });
}

test('exits non-zero on an invalid PORT', async () => {
  const child = spawn(process.execPath, [entryPoint], {
    env: { PATH: process.env.PATH, PORT: 'invalid' },
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  const [code] = await once(child, 'exit');
  assert.notEqual(code, 0);
});
