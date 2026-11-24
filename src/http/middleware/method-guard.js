const ALLOWED_METHODS = new Set(['GET', 'HEAD']);

export const methodGuard = (req, res, next) => {
  if (ALLOWED_METHODS.has(req.method)) return next();
  return res.status(405).set('Allow', 'GET, HEAD').type('text/plain').send('Method Not Allowed');
};
