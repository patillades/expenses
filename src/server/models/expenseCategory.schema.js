const mongoose = require('mongoose');

/**
 * Mongoose model for an expense's category
 *
 * @typedef {model} Expense
 */
const expenseCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '{PATH} is required!'],
    text: true,
  },
});

module.exports = mongoose.model('ExpenseCategory', expenseCategorySchema);
