import {
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  CREATE_EXPENSE_REQUEST,
  DELETE_EXPENSE_REQUEST,
  EDIT_EXPENSE_REQUEST,
  GET_EXPENSE_CATEGORIES_REQUEST,
} from 'constants/actionTypes';

/**
 * Get the object to be used as the body of a API POST request
 *
 * @param {ActionType} type
 * @param {object} state
 * @returns {object}
 */
function requestBody(type, state) {
  const { registration, login } = state.authenticated;
  const { create, edit } = state.expenses;

  switch (type) {
    case REGISTRATION_REQUEST:
      return registration;

    case LOGIN_REQUEST:
      return login;

    case CREATE_EXPENSE_REQUEST:
      return create;

    case EDIT_EXPENSE_REQUEST:
      return edit;

    case CREATE_EXPENSE_CATEGORY_REQUEST:
      return { title: state.modals.inputModal.inputValue };

    default:
      return {};
  }
}

export default requestBody;
