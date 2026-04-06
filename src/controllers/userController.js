const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role/status
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const { role, status } = req.body;
    const validRoles = ['viewer', 'analyst', 'admin'];
    const validStatus = ['active', 'inactive'];

    if (!role && !status) {
      res.status(400);
      return next(new Error('Please provide at least one field (role or status) to update'));
    }

    if (role && !validRoles.includes(role)) {
      res.status(400);
      return next(new Error('Role must be viewer, analyst, or admin'));
    }

    if (status && !validStatus.includes(status)) {
      res.status(400);
      return next(new Error('Status must be active or inactive'));
    }

    const user = await User.findById(req.params.id);

    if (user) {
      if (role) user.role = role;
      if (status) user.status = status;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};
