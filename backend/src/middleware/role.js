// Middleware to check if user is an official
export const isOfficial = (req, res, next) => {
  if (req.user && req.user.role === 'official') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Officials only.' });
  }
};

// Middleware to check if user is a citizen
export const isCitizen = (req, res, next) => {
  if (req.user && req.user.role === 'citizen') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Citizens only.' });
  }
};

// Middleware to check user role
export const hasRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
  };
};