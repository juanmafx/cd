import { loadConfig } from './config/load-config.js';
import { startServer, stopServer } from './server.js';

const server = await startServer(loadConfig());

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await stopServer(server);
    process.exitCode = 0;
  });
}
