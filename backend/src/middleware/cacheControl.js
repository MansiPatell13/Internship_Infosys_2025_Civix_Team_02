// Middleware to prevent caching of sensitive routes
export const preventCache = (req, res, next) => {
  // Set headers to prevent caching
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
};