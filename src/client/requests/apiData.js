import objToQueryString from 'utils/objToQueryString';
import {
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  CREATE_EXPENSE_REQUEST,
  GET_EXPENSES_REQUEST,
  DELETE_EXPENSE_REQUEST,
  EDIT_EXPENSE_REQUEST,
  CREATE_EXPENSE_CATEGORY_REQUEST,
  GET_EXPENSE_CATEGORIES_REQUEST,
} from 'constants/actionTypes';

/**
 * Get the API endpoint URI related to the given action type
 *
 * @param {ActionType} type
 * @param {object} state - The state of redux's store
 * @param {?ObjectId} userId
 * @returns {{method: string, uri: string}}
 */
function apiData(type, state, userId) {
  switch (type) {
    case REGISTRATION_REQUEST:
      return {
        method: 'POST',
        uri: '/api/users',
      };

    case LOGIN_REQUEST:
      return {
        method: 'POST',
        uri: '/api/users/login',
      };

    case CREATE_EXPENSE_REQUEST:
      return {
        method: 'POST',
        uri: `/api/users/${userId}/expenses`,
      };

    case GET_EXPENSES_REQUEST: {
      const query = objToQueryString(state.filters, true);

      return {
        method: 'GET',
        uri: `/api/users/${userId}/expenses?${query}`,
      };
    }

    case DELETE_EXPENSE_REQUEST:
      return {
        method: 'DELETE',
        uri: `/api/users/${userId}/expenses/${state.expenses.expenseIdToDelete}`,
      };

    case EDIT_EXPENSE_REQUEST:
      return {
        method: 'PUT',
        uri: `/api/users/${userId}/expenses/${state.expenses.expenseIdOnEdition}`,
      };

    case CREATE_EXPENSE_CATEGORY_REQUEST:
      return {
        method: 'POST',
        uri: `/api/users/${userId}/expenseCategories`,
      };

    case GET_EXPENSE_CATEGORIES_REQUEST:
      return {
        method: 'GET',
        uri: `/api/users/${userId}/expenseCategories`
      }
  }
}

export default apiData;
