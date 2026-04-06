const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      return next(new Error('Invalid input'));
    }

    if (!emailRegex.test(email)) {
      res.status(400);
      return next(new Error('Invalid input'));
    }

    if (typeof password !== 'string' || password.length < 6) {
      res.status(400);
      return next(new Error('Invalid input'));
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'viewer',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data received'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error('Invalid input'));
    }

    if (!emailRegex.test(email)) {
      res.status(400);
      return next(new Error('Invalid input'));
    }

    if (typeof password !== 'string' || password.length < 6) {
      res.status(400);
      return next(new Error('Invalid input'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    if (user.status !== 'active') {
      res.status(403);
      return next(new Error('User account is inactive. Please contact admin.'));
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    }

    res.status(401);
    return next(new Error('Invalid email or password'));

  } catch (error) {
    next(error);
  }
};
