const Expense = require('models/expense.schema');

/**
 * Create an expense with the given params and user
 *
 * @param {{date: string|Date,
 * description: string,
 * amount: number,
 * comment: string|undefined}} params
 * @param {string} userId
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

module.exports = { create };
