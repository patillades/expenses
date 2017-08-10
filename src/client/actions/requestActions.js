import fetch from 'isomorphic-fetch';

import objToQueryString from 'utils/objToQueryString';
import MODAL_MESSAGES from 'constants/messages';
import {
  ERROR,
  SUCCESS,
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  CREATE_EXPENSE_REQUEST,
  GET_EXPENSES_REQUEST,
  DELETE_EXPENSE_REQUEST,
  EDIT_EXPENSE_REQUEST,
  CREATE_EXPENSE_CATEGORY_REQUEST,
  GET_EXPENSE_CATEGORIES_REQUEST,
} from 'constants/actionTypes';

// @todo add tests on this file

// regexp for HTTP success' status
const successStatus = /^2\d{2}$/;

/**
 * Types of actions that can initialize an API call
 *
 * @typedef {(REGISTRATION_REQUEST
 * |LOGIN_REQUEST
 * |CREATE_EXPENSE_REQUEST
 * |GET_EXPENSES_REQUEST
 * |DELETE_EXPENSE_REQUEST
 * |EDIT_EXPENSE_REQUEST
 * |CREATE_EXPENSE_CATEGORY_REQUEST
 * |GET_EXPENSE_CATEGORIES_REQUEST)} ActionType
 */

/**
 * A request of the given type has been sent to the API
 *
 * @param {ActionType} type
 * @param {object} [data={}] - Optional payload that can be added when initiating the request
 * @returns {{type: ActionType, data: object}}
 */
function initRequest(type, data = {}) {
  return { type, data };
}

/**
 * Get the API endpoint URI related to the given action type
 *
 * @param {ActionType} type
 * @param {object} state - The state of redux's store
 * @param {?ObjectId} userId
 * @returns {{method: string, uri: string}}
 */
function getRequestData(type, state, userId) {
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
function getBodyObj(type, state) {
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

/**
 * Fill the fetch request with the options associated to each action type
 *
 * @param {ActionType} type
 * @param {object} state - The state of redux's store
 * @param {?string} token
 * @param {?ObjectId} userId
 * @param {boolean} [isTest=false] - set to true on tests so an absolute URL is used
 * @return {Promise}
 */
function fetchRequest(type, state, token, userId, isTest = false) {
  const { uri, method } = getRequestData(type, state, userId);

  const options = {
    method,
    headers: {
      Authorization: token ? (`Bearer ${token}`) : null,
    },
  };

  if (['POST', 'PUT'].includes(method)) {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    options.body = objToQueryString(getBodyObj(type, state));
  }

  return fetch(`${isTest ? 'http://localhost:3000' : ''}${uri}`, options);
}

/**
 * The API request ended successfully
 *
 * @param {ActionType} actionType
 * @param {object|array} data
 * @returns {{type: string,
 * msg: string,
 * data: object|array}}
 */
function requestSucceeded(actionType, data) {
  const msg = MODAL_MESSAGES.hasOwnProperty(actionType)
    ? MODAL_MESSAGES[actionType]
    : '';

  const type = actionType + SUCCESS;

  return { type, msg, data };
}

/**
 * The API request ended in an error
 *
 * @param {ActionType} type
 * @param {string} msg
 * @returns {{type: string, msg: string}}
 */
function requestFailed(type, msg) {
  return {
    type: type + ERROR,
    msg,
  };
}

/**
 * Handle request failure when the promises have been rejected for unexpected reasons (network
 * error, JSON parse unexpected chars...)
 *
 * @param {ActionType} type
 * @returns {{type: ActionType, msg: string}}
 */
function internalError(type) {
  return requestFailed(
    type,
    'something wrong happened, please try again later'
  );
}

/**
 * Send a request to the API
 *
 * @param {ActionType} type
 * @param {object} [data={}] - payload that can be added when initiating the request
 * @param {boolean} [isTest=false] - set to true on tests so an absolute URL is used
 * @returns {function: (Promise)} If it worked, dispatch the token found on the response object,
 * or the error message. If it was rejected, dispatch an error message.
 */
function sendRequest(type, data = {}, isTest = false) {
  return (dispatch, getState) => {
    dispatch(initRequest(type, data));

    const state = getState();
    const { id, token } = state.authenticated;

    return fetchRequest(type, state, token, id, isTest).then(
      (response) => {
        // 204 (no content) comes without a body and JSON parsing would throw an error
        const bodyData = response.status === 204 ? 'text' : 'json';

        return response[bodyData]().then(
          (resp) => {
            if (successStatus.test(response.status)) {
              return dispatch(requestSucceeded(type, resp));
            }

            return dispatch(requestFailed(type, resp.msg));
          },

          () => dispatch(internalError(type))
        );
      },

      () => dispatch(internalError(type))
    );
  };
}

export { initRequest, requestSucceeded, requestFailed };
export default sendRequest;
