const mongoose = require('mongoose');

/**
 * Mongoose model for an expense's category
 *
 * @typedef {model} ExpenseCategory
 */
const expenseCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '{PATH} is required!'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '{PATH} is required!'],
  },
}, {
  toJSON: {
    // @todo remove userId from GET user categories response
    transform: (doc, ret) => {
      const obj = Object.assign({}, ret, { id: doc._id });

      delete obj._id;
      delete obj.__v;

      return obj;
    },
  },
});

module.exports = mongoose.model('ExpenseCategory', expenseCategorySchema);
