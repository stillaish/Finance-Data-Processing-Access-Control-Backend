const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }

  try {
    if (!process.env.JWT_SECRET) {
      res.status(500);
      return next(new Error('JWT_SECRET must be defined'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, user no longer exists'));
    }

    if (req.user.status !== 'active') {
      res.status(403);
      return next(new Error('Not authorized, account inactive'));
    }

    return next();
  } catch (error) {
    res.status(401);
    return next(new Error('Not authorized, token failed'));
  }
};

// Grant access to specific roles
// Usage: router.get('/', protect, authorize('admin', 'analyst'), getRecords);
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized for this route'));
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`User role '${req.user.role}' is not authorized to access this route`));
    }
    return next();
  };
};

module.exports = { protect, authorize };
