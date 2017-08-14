import {
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  CREATE_EXPENSE_REQUEST,
  DELETE_EXPENSE_REQUEST,
  EDIT_EXPENSE_REQUEST,
  GET_EXPENSE_CATEGORIES_REQUEST,
} from 'constants/actionTypes';

/**
 * Get the body for create/edit requests
 *
 * @param {CreateExpenseState} expenseData
 * @return {{date: MomentDate, description: string, amount: number, comment: string }}
 */
function getCreateOrEditExpenseBody(expenseData) {
  const body = Object.assign({}, expenseData);
  const { time } = body;

  // the category is optional, so leave it out of the request if empty
  if (!body.expenseCategoryId) {
    delete body.expenseCategoryId;
  }

  // time can be null if the user clicks on the "X" that closes the timepicker
  if (time) {
    body.date
      .hours(time.hours())
      .minutes(time.minutes())
      .seconds(0);
  }

  delete body.time;

  return body;
}

/**
 * Get the object to be used as the body of a API POST request
 *
 * @param {ActionType} type
 * @param {object} state
 * @returns {object}
 */
function requestBody(type, state) {
  const { registration, login } = state.authenticated;

  switch (type) {
    case REGISTRATION_REQUEST:
      return registration;

    case LOGIN_REQUEST:
      return login;

    case CREATE_EXPENSE_REQUEST:
      return getCreateOrEditExpenseBody(state.expenses.create);

    case EDIT_EXPENSE_REQUEST:
      return getCreateOrEditExpenseBody(state.expenses.edit);

    case CREATE_EXPENSE_CATEGORY_REQUEST:
      return { title: state.modals.inputModal.inputValue };

    default:
      return {};
  }
}

export default requestBody;
