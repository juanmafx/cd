const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3000;
const MAX_PORT = 65535;

const parsePort = (rawPort) => {
  if (rawPort === undefined || rawPort === '') return DEFAULT_PORT;
  if (!/^\d+$/.test(rawPort) || Number(rawPort) > MAX_PORT) {
    throw new RangeError(`PORT must be an integer between 0 and ${MAX_PORT}`);
  }
  return Number(rawPort);
};

export const loadConfig = (env = process.env) => ({
  host: env.HOST || DEFAULT_HOST,
  port: parsePort(env.PORT),
});
