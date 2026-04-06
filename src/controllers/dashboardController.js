const Record = require('../models/Record');

// @desc    Dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const records = await Record.find({ createdBy: userId }) || [];

    if (!records.length) {
      return res.json({
        income: 0,
        expense: 0,
        netBalance: 0,
        categoryBreakdown: {},
        totalRecords: 0,
      });
    }

    let income = 0;
    let expense = 0;
    const categoryBreakdown = {};

    records.forEach((r) => {
      if (r.type === 'income') {
        income += r.amount;
      } else if (r.type === 'expense') {
        expense += r.amount;
      }

      if (!categoryBreakdown[r.category]) {
        categoryBreakdown[r.category] = 0;
      }
      categoryBreakdown[r.category] += r.amount;
    });

    res.json({
      income,
      expense,
      netBalance: income - expense,
      categoryBreakdown,
      totalRecords: records.length,
    });
  } catch (error) {
    next(error);
  }
};