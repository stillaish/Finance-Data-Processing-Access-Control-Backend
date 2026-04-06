const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Dashboard routes require authentication
router.use(protect);

// Viewers, Analysts, and Admins can view the dashboard
router.route('/summary')
  .get(authorize('viewer', 'analyst', 'admin'), getDashboardSummary);

module.exports = router;
