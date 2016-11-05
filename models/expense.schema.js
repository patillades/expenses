const mongoose = require('mongoose');

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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

module.exports = mongoose.model('Expense', expenseSchema);
