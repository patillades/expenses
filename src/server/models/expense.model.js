const moment = require('moment');
const _ = require('lodash');
const winston = require('winston');

const Expense = require('models/expense.schema');
const respObj = require('utils/respObj');
const errMsgs = require('utils/errMsgs');
const getOrNull = require('utils/getOrNull');

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
  const expenseCategoryId = getOrNull(params, 'expenseCategoryId');

  const expense = new Expense(Object.assign(
    {},
    params,
    { expenseCategoryId, userId }
  ));

  return expense.save().then(
    result => result,

    err => Promise.reject(errMsgs.getValidationErrorMsg(err, Expense.modelName))
  );
}

/**
 * Convert the submitted query params to mongoose query conditions
 *
 * @param {object} conditions
 * @param {string} value
 * @param {string} key
 * @return {object}
 */
function queryParamsToConditions(conditions, value, key) {
  if (!value) {
    return conditions;
  }

  if (key === '$text') {
    return Object.assign({ [key]: { $search: value } }, conditions);
  }

  const [operator, field] = key.split('_');

  if (field === 'date') {
    const date = moment(value);

    if (operator === '$gte') {
      date.hours(0).minutes(0).seconds(0);
    } else {
      date.hours(23).minutes(59).seconds(59);
    }

    return _.merge({}, conditions, { [field]: { [operator]: date.format() } });
  }

  return _.merge({}, conditions, { [field]: { [operator]: value } });
}

/**
 * Read a user's expenses
 *
 * @param {ObjectId} userId
 * @param {object} queryParams
 * @returns {Promise.<Expense[], RespObj>}
 */
function read(userId, queryParams) {
  const conditions = _.reduce(queryParams, queryParamsToConditions, { userId });

  return Expense
    .find(conditions)
    .sort('-date')
    .then(
      result => result,

      (err) => {
        if (err.name === 'CastError') {
          return Promise.reject(
            errMsgs.getCastErrorMsg(err.path, Expense.modelName)
          );
        }

        winston.error('Unhandled error on read@expense.model', err);

        return Promise.reject(
          respObj.getInternalErrResp()
        );
      }
    );
}

/**
 * Update an expense with the given params
 *
 * @param {ObjectId} _id
 * @param {ObjectId} userId
 * @param {object} params - fields to be updated
 * @return {Promise.<Expense, RespObj>}
 */
function update(_id, userId, params) {
  const expenseCategoryId = getOrNull(params, 'expenseCategoryId');

  return Expense
    .findOneAndUpdate(
      { _id, userId },
      Object.assign({}, params, { expenseCategoryId }),
      { runValidators: true }
    )
    .then(
      result => result,

      (err) => {
        if (err.name === 'ValidationError') {
          return Promise.reject(
            respObj.getBadReqResp(errMsgs.getValidationErrorMsg(err, Expense.modelName))
          );
        }

        if (err.name === 'CastError') {
          return Promise.reject(
            errMsgs.getCastErrorMsg(err.path, Expense.modelName)
          );
        }

        winston.error('Unhandled error on update@expense.model', err);

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

module.exports = {
  create,
  read,
  update,
  remove,
};
