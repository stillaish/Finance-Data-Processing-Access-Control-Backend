const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All user management routes require login (protect) and admin permissions (authorize)
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAllUsers);

router.route('/:id')
  .put(updateUser);

module.exports = router;
