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
  },
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = doc._id;

      delete ret.userId;
      delete ret._id;
      delete ret.__v;

      return ret;
    }
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
