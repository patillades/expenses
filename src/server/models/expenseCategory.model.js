const ExpenseCategory = require('models/expenseCategory.schema');
const errMsgs = require('utils/errMsgs');

/**
 * Create an expense category with the given params and user
 *
 * @param {{title: string}} params
 * @param {ObjectId} userId
 * @returns {Promise.<ExpenseCategory, string>}
 */
function create(params, userId) {
  const category = new ExpenseCategory(Object.assign(
    {},
    params,
    { userId }
  ));

  return category.save().then(
    result => result,

    err => Promise.reject(errMsgs.getValidationErrorMsg(err, ExpenseCategory.modelName))
  );
}

/**
 * Read a user's expenses' categories
 *
 * @param {ObjectId} userId
 * @returns {Promise.<ExpenseCategory[], RespObj>}
 */
function read(userId) {
  return ExpenseCategory
    .find({ userId })
    .then(
      result => result,

      (err) => {
        winston.error('Unhandled error on read@expenseCategory.model', err);

        return Promise.reject(
          respObj.getInternalErrResp()
        );
      }
    );
}

module.exports = { create, read };
