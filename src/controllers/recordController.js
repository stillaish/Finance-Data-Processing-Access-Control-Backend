const Record = require('../models/Record');

const validTypes = ['income', 'expense'];

// @desc    Get all records
// @route   GET /api/records
// @access  Private (Analyst & Admin)
exports.getRecords = async (req, res, next) => {
  try {
    const { type, search, startDate, endDate } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
      res.status(400);
      return next(new Error('Pagination values must be greater than 0'));
    }

    const filter = {};

    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    if (type) {
      if (!validTypes.includes(type)) {
        res.status(400);
        return next(new Error('Invalid type'));
      }
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: 'i' } },
        { note: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const records = await Record.find(filter)
      .populate('createdBy', 'name email')
      .sort('-date')
      .skip(skip)
      .limit(limit);

    const total = await Record.countDocuments(filter);

    res.json({
      count: records.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create record
exports.createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, note } = req.body;

    if (amount == null || !type || !category) {
      res.status(400);
      return next(new Error('Amount, type, and category are required'));
    }

    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400);
      return next(new Error('Amount must be a number greater than 0'));
    }

    if (!validTypes.includes(type)) {
      res.status(400);
      return next(new Error('Type must be either income or expense'));
    }

    if (typeof category !== 'string' || !category.trim()) {
      res.status(400);
      return next(new Error('Category is required'));
    }

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      note,
      createdBy: req.user._id,
    });

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

// @desc    Update record
exports.updateRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      res.status(404);
      return next(new Error('Record not found'));
    }

    if (record.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not allowed'));
    }

    const allowedUpdates = ['amount', 'type', 'category', 'date', 'note'];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    });

    if (!Object.keys(updates).length) {
      res.status(400);
      return next(new Error('No valid fields provided for update'));
    }

    if (updates.amount != null && (typeof updates.amount !== 'number' || updates.amount <= 0)) {
      res.status(400);
      return next(new Error('Amount must be a number greater than 0'));
    }

    if (updates.type && !validTypes.includes(updates.type)) {
      res.status(400);
      return next(new Error('Type must be either income or expense'));
    }

    if (updates.category != null && (typeof updates.category !== 'string' || !updates.category.trim())) {
      res.status(400);
      return next(new Error('Category is required'));
    }

    const updated = await Record.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete record
exports.deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      res.status(404);
      return next(new Error('Record not found'));
    }

    if (record.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Not allowed'));
    }

    await record.deleteOne();

    res.json({ message: 'Record deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
};