import { loadConfig } from './config/load-config.js';
import { startServer, stopServer } from './server.js';

const server = await startServer(loadConfig());

let stopping;
const shutdown = () => {
  stopping ??= stopServer(server).then(() => {
    process.exitCode = 0;
  });
};

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, shutdown);
}
