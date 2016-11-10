const Expense = require('models/expense.schema');

/**
 * Create an expense with the given params and user
 *
 * @param {{date: string|Date,
 * description: string,
 * amount: number,
 * comment: string|undefined}} params
 * @param {ObjectId} userId
 * @returns {Promise.<Expense, string>}
 */
function create(params, userId) {
  const expense = new Expense(Object.assign(
    {},
    params,
    { userId }
  ));

  return expense.save().then(
    result => result,

    err => {
      let msg;
      const errField = Object.keys(err.errors)[0];

      if (err.errors[errField].name === 'CastError') {
        if (errField === 'amount') {
          msg = 'amount has to be a number';
        } else {
          msg = 'date has to be in the "Y-m-d (H:i:s)" format';
        }
      } else {
        // return the message belonging to the first error key
        msg = err.errors[errField].message;
      }

      return Promise.reject(msg);
    }
  );
}

/**
 * Read a user's expenses
 *
 * @param {ObjectId} userId
 * @returns {Promise.<Expense[], Error>}
 */
function read(userId) {
  return Expense
    .find({ userId })
    .sort('-date');
}

/**
 * Remove a given expense if it belongs to the given user
 *
 * @param {ObjectId} _id - The id of the Expense to be removed
 * @param {ObjectId} userId
 * @return {Promise.<Expense, Error>}
 */
function remove(_id, userId) {
  return Expense
    .findOneAndRemove({ _id, userId });
}

module.exports = { create, read, remove };
