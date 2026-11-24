import assert from 'node:assert/strict';
import { once } from 'node:events';
import { connect } from 'node:net';
import { test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { startServer, stopServer } from '../../src/server.js';

for (const [name, payload] of [
  ['idle', ''],
  ['partial-header', 'GET / HTTP/1.1\r\nHost: localhost\r\nX-Stalled: '],
]) {
  test(`shutdown closes a stalled ${name} connection after the grace period`, { timeout: 5_000 }, async (t) => {
    const server = await startServer({ host: '127.0.0.1', port: 0 }, { log: () => {} });
    const socket = connect(server.address().port, '127.0.0.1');
    t.after(() => {
      socket.destroy();
      server.closeAllConnections();
    });
    socket.on('error', () => {});
    await once(socket, 'connect');
    if (payload) socket.write(payload);
    await delay(50);
    const closed = once(socket, 'close');
    await stopServer(server, { graceMs: 50 });
    await closed;
    assert.equal(server.listening, false);
  });
}
