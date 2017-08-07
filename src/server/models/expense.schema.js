const mongoose = require('mongoose');

/**
 * Mongoose model for an expense
 *
 * @typedef {model} Expense
 */
const expenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, '{PATH} is required!'],
  },
  description: {
    type: String,
    required: [true, '{PATH} is required!'],
    text: true,
  },
  amount: {
    type: Number,
    required: [true, '{PATH} is required!'],
  },
  comment: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '{PATH} is required!'],
  },
  expenseCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpenseCategory',
  },
}, {
  toJSON: {
    transform: (doc, ret) => {
      const obj = Object.assign({}, ret, { id: doc._id });

      delete obj.userId;
      delete obj._id;
      delete obj.__v;

      return obj;
    },
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
