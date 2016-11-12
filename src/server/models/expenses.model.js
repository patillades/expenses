const Expense = require('models/expense.schema');
const respObj = require('utils/respObj');

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

    err => Promise.reject(getValidationErrorMsg(err))
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
 * Update an expense with the given params
 *
 * @param {ObjectId} _id
 * @param {ObjectId} userId
 * @param {object} params - fields to be updated
 * @return {Promise.<Expense, string>}
 */
function update(_id, userId, params) {
  return Expense
    .findOneAndUpdate({ _id, userId }, params, { runValidators: true })
    .then(
      result => result,

      err => {
        console.log('update',err);

        if (err.name === 'ValidationError') {
          return Promise.reject(
            respObj.getBadReqResp(getValidationErrorMsg(err))
          );
        }

        if (err.name === 'CastError') {
          return Promise.reject(
            getCastErrorMsg(err.path)
          );
        }

        // @todo log error
        return Promise.reject(
          respObj.getInternalErrResp()
        );
      }
    );
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

/**
 * Get the message belonging to the first key when a mongoose validation error happens
 *
 * @param {ValidationError} err
 * @return {string}
 */
function getValidationErrorMsg(err) {
  const errField = Object.keys(err.errors)[0];

  if (err.errors[errField].name === 'CastError') {
    return getCastErrorMsg(errField).msg;
  }

  return err.errors[errField].message;
}

const EXPENSE_NOT_FOUND = 'expense not found';
const USER_NOT_FOUND = 'user not found';
const AMOUNT_SHOULD_BE_NUM = 'amount has to be a number';
const DATE_SHOULD_BE_DATE = 'date has to be in the "Y-m-d (H:i)" format';

/**
 * Get the msg related to a CastError depending on the field where it happened
 *
 * @param {string} field
 * @return {{status: number, msg: string}}
 */
function getCastErrorMsg(field) {
  switch (field) {
    case '_id':
      return respObj.getNotFoundResp(EXPENSE_NOT_FOUND);

    case 'userId':
      return respObj.getNotFoundResp(USER_NOT_FOUND);

    case 'amount':
      return respObj.getBadReqResp(AMOUNT_SHOULD_BE_NUM);

    case 'date':
      return respObj.getBadReqResp(DATE_SHOULD_BE_DATE);
  }
}

module.exports = {
  EXPENSE_NOT_FOUND,
  USER_NOT_FOUND,
  AMOUNT_SHOULD_BE_NUM,
  DATE_SHOULD_BE_DATE,
  create,
  read,
  update,
  remove,
};
