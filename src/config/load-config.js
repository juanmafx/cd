import { isIP } from 'node:net';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3000;
const MAX_PORT = 65535;
const HOSTNAME_PATTERN = /^(?=.{1,253}$)(?![\d.]+$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;

const parseHost = (rawHost) => {
  if (rawHost === undefined || rawHost === '') return DEFAULT_HOST;
  if (isIP(rawHost) === 0 && !HOSTNAME_PATTERN.test(rawHost)) {
    throw new RangeError('HOST must be an IP address or a valid hostname');
  }
  return rawHost;
};

const parsePort = (rawPort) => {
  if (rawPort === undefined || rawPort === '') return DEFAULT_PORT;
  if (!/^\d+$/.test(rawPort) || Number(rawPort) > MAX_PORT) {
    throw new RangeError(`PORT must be an integer between 0 and ${MAX_PORT}`);
  }
  return Number(rawPort);
};

export const loadConfig = (env = process.env) => ({
  host: parseHost(env.HOST),
  port: parsePort(env.PORT),
});
