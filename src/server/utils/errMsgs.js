const respObj = require('utils/respObj');

const ExpenseCategory = require('models/expenseCategory.schema');
const User = require('models/user.schema');

const NOT_FOUND = ' not found';
const EXPENSE_NOT_FOUND = `expense${NOT_FOUND}`;
const USER_NOT_FOUND = `user${NOT_FOUND}`;
const DUPLICATE_MAIL = 'mail already registered';
const AMOUNT_SHOULD_BE_NUM = 'amount has to be a number';
const DATE_SHOULD_BE_DATE = 'date has a wrong format, use "m/d/Y (H:i)" instead';
const EXPENSE_CATEGORY_NOT_FOUND = 'expense category not found';
const DUPLICATE_EXPENSE_CATEGORY = 'expense category already exists';
const DEFAULT_CAST_ERROR = 'cast error';
const DEFAULT_UNIQUE_ERROR = 'unique error';

/**
 * Get the msg related to a CastError depending on the field where it happened
 *
 * @param {string} field
 * @param {?string} [modelName=null] - name of the mongoose model
 * @return {RespObj}
 */
function getCastErrorMsg(field, modelName = null) {
  switch (field) {
    case '_id':
      return respObj.getNotFoundResp(modelName + NOT_FOUND);

    case 'userId':
      return respObj.getNotFoundResp(USER_NOT_FOUND);

    case 'amount':
      return respObj.getBadReqResp(AMOUNT_SHOULD_BE_NUM);

    case 'date':
      return respObj.getBadReqResp(DATE_SHOULD_BE_DATE);

    case 'expenseCategoryId':
      return respObj.getBadReqResp(EXPENSE_CATEGORY_NOT_FOUND);

    default:
      return respObj.getBadReqResp(DEFAULT_CAST_ERROR);
  }
}

/**
 * Get the message belonging to the first key when a mongoose validation error happens
 *
 * @param {ValidationError} err
 * @param {string} modelName - name of the mongoose model
 * @return {string}
 */
function getValidationErrorMsg(err, modelName) {
  console.log('err', err)
  const errField = Object.keys(err.errors)[0];
  console.log('errField', errField)

  if (err.errors[errField].name === 'CastError') {
    return getCastErrorMsg(errField, modelName).msg;
  }

  return err.errors[errField].message;
}

/**
 * Get the msg related to a Mongo Error caused by a "unique" index
 *
 * @param {string} modelName - name of the mongoose model
 * @return {string}
 */
function getUniqueErrorMsg(modelName) {
  console.log('getUniqueErrorMsg',modelName)
  switch (modelName) {
    case User.modelName:
      return DUPLICATE_MAIL;

    case ExpenseCategory.modelName:
      return DUPLICATE_EXPENSE_CATEGORY;

    default:
      return DEFAULT_UNIQUE_ERROR;
  }
}

module.exports = {
  EXPENSE_NOT_FOUND,
  USER_NOT_FOUND,
  AMOUNT_SHOULD_BE_NUM,
  DATE_SHOULD_BE_DATE,
  EXPENSE_CATEGORY_NOT_FOUND,
  DUPLICATE_EXPENSE_CATEGORY,
  getCastErrorMsg,
  getValidationErrorMsg,
  getUniqueErrorMsg,
};
