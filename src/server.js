import { createApp } from './app.js';

const REQUEST_TIMEOUT_MS = 30_000;
const HEADERS_TIMEOUT_MS = 10_000;
const KEEP_ALIVE_TIMEOUT_MS = 5_000;

export const startServer = ({ host, port }, appOptions = {}) =>
  new Promise((resolve, reject) => {
    const log = appOptions.log ?? console.log;
    const server = createApp(appOptions).listen(port, host, (error) => {
      if (error) return reject(error);
      log(`Listening on ${host}:${server.address().port}`);
      return resolve(server);
    });
    server.requestTimeout = REQUEST_TIMEOUT_MS;
    server.headersTimeout = HEADERS_TIMEOUT_MS;
    server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT_MS;
  });

export const stopServer = (server) =>
  new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
    server.closeIdleConnections();
  });
