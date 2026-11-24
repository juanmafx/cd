import express from 'express';
import { createErrorHandler } from './http/middleware/error-handler.js';
import { methodGuard } from './http/middleware/method-guard.js';
import { notFound } from './http/middleware/not-found.js';
import { securityHeaders } from './http/middleware/security-headers.js';
import { createTimestampHandler } from './http/routes/timestamp-route.js';

export const createApp = ({
  clock = () => new Date(),
  log = console.log,
  logError = console.error,
} = {}) => {
  const app = express();
  app.disable('x-powered-by');
  app.disable('etag');
  app.use(securityHeaders, methodGuard);
  app.get('/{*path}', createTimestampHandler({ clock, log }));
  app.use(notFound);
  app.use(createErrorHandler(logError));
  return app;
};
