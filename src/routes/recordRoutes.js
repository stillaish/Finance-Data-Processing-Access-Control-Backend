const express = require('express');
const router = express.Router();
const {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All record routes require authentication
router.use(protect);

router.route('/')
  .get(authorize('admin', 'analyst'), getRecords)
  .post(authorize('admin'), createRecord);

router.route('/:id')
  .put(authorize('admin'), updateRecord)
  .delete(authorize('admin'), deleteRecord);

module.exports = router;
