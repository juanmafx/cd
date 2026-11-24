const SECURITY_HEADERS = Object.freeze({
  'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
});

export const securityHeaders = (_req, res, next) => {
  res.set(SECURITY_HEADERS);
  next();
};
