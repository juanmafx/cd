const isClientError = (status) => Number.isInteger(status) && status >= 400 && status < 500;

export const createErrorHandler = (logError) => (error, _req, res, next) => {
  if (res.headersSent) return next(error);
  if (isClientError(error.status)) {
    return res.status(error.status).type('text/plain').send('Bad Request');
  }
  logError(`Request failed: ${error.name}`);
  return res.status(500).type('text/plain').send('Internal Server Error');
};
