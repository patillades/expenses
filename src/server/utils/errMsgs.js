const respObj = require('utils/respObj');

const NOT_FOUND = ' not found';
const EXPENSE_NOT_FOUND = 'expense' + NOT_FOUND;
const USER_NOT_FOUND = 'user' + NOT_FOUND;
const AMOUNT_SHOULD_BE_NUM = 'amount has to be a number';
const DATE_SHOULD_BE_DATE = 'date has to be in the "Y-m-d (H:i)" format';

/**
 * Get the msg related to a CastError depending on the field where it happened
 *
 * @param {string} field
 * @param {?string} [model=null] - name of the mongoose model
 * @return {RespObj}
 */
function getCastErrorMsg(field, model = null) {
  switch (field) {
    case '_id':
      return respObj.getNotFoundResp(model + NOT_FOUND);

    case 'userId':
      return respObj.getNotFoundResp(USER_NOT_FOUND);

    case 'amount':
      return respObj.getBadReqResp(AMOUNT_SHOULD_BE_NUM);

    case 'date':
      return respObj.getBadReqResp(DATE_SHOULD_BE_DATE);
  }
}

/**
 * Get the message belonging to the first key when a mongoose validation error happens
 *
 * @param {ValidationError} err
 * @param {string} model - name of the mongoose model
 * @return {string}
 */
function getValidationErrorMsg(err, model) {
  const errField = Object.keys(err.errors)[0];

  if (err.errors[errField].name === 'CastError') {
    return getCastErrorMsg(errField, model).msg;
  }

  return err.errors[errField].message;
}

module.exports = {
  EXPENSE_NOT_FOUND,
  USER_NOT_FOUND,
  AMOUNT_SHOULD_BE_NUM,
  DATE_SHOULD_BE_DATE,
  getCastErrorMsg,
  getValidationErrorMsg,
};
