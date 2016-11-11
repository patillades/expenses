import jwtDecode from 'jwt-decode';

import objToQueryString from 'utils/objToQueryString';
import { MODAL_MESSAGES } from 'constants/messages';
import {
  ERROR,
  SUCCESS,
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  CREATE_EXPENSE_REQUEST,
  GET_EXPENSES_REQUEST,
  DELETE_EXPENSE_REQUEST
} from 'constants/actionTypes';

// regexp for HTTP success' status
const successStatus = /^2\d{2}$/;

/**
 * Types of actions that can initialize an API call
 *
 * @typedef {(REGISTRATION_REQUEST
 * |LOGIN_REQUEST
 * |CREATE_EXPENSE_REQUEST
 * |GET_EXPENSES_REQUEST
 * |DELETE_EXPENSE_REQUEST)} ActionType
 */

/**
 * Send a request to the API
 *
 * @param {ActionType} type
 * @param {object} [data={}] - Optional payload that can be added when initiating the request
 * @returns {function: (Promise)} If it worked, dispatch the token found on the response object,
 * or the error message. If it was rejected, dispatch an error message.
 */
function sendRequest(type, data = {}) {
  return (dispatch, getState) => {
    dispatch(initRequest(type, data));

    fetchRequest(type, getState()).then(
      response => response.json().then(
        resp => {
          if (successStatus.test(response.status)) {
            return dispatch(requestSucceeded(type, resp));
          }

          return dispatch(requestFailed(type, resp.msg));
        },

        rejected => dispatch(internalError(type))
      ),

      rejected => dispatch(internalError(type))
    );
  }
}

/**
 * A request of the given type has been sent to the API
 *
 * @param {ActionType} type
 * @param {object} [data={}] - Optional payload that can be added when initiating the request
 * @returns {{type: string}}
 */
function initRequest(type, data = {}) {
  return { type, data };
}

/**
 * Fill the fetch request with the options associated to each action type
 *
 * @param {ActionType} type
 * @param {object} state - The state of redux's store
 * @return {Promise}
 */
function fetchRequest(type, state) {
  const { token } = state.authenticated;
  const { uri, method } = getActionTypeRequestData(type, state);

  const options = {
    method,
    headers: {
      Authorization: token ? ('Bearer ' + token) : null,
    },
  };

  if (method === 'POST') {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    options.body = objToQueryString(getBodyObj(type, state));
  }

  return fetch(uri, options);
}

/**
 * Get the API endpoint URI related to the given action type
 *
 * @param {ActionType} type
 * @param {object} state - The state of redux's store
 * @returns {string}
 */
function getActionTypeRequestData(type, state) {
  const userId = getUserIdFromToken(state.authenticated.token);

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

    case GET_EXPENSES_REQUEST:
      return {
        method: 'GET',
        uri: `/api/users/${userId}/expenses`,
      };

    case DELETE_EXPENSE_REQUEST:
      return {
        method: 'DELETE',
        uri: `/api/users/${userId}/expenses/${state.expenses.expenseIdToDelete}`,
      };
  }
}

/**
 * Decode the token, if it exists, and get the user id
 *
 * @param {?string} token
 * @returns {string}
 */
function getUserIdFromToken(token) {
  return token ? jwtDecode(token).sub : '';
}

/**
 * Get the state object to be used as the body of a API POST request
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
      const body = Object.assign({}, state.expenses.create);
      const { time } = body;

      body.date
        .hours(time.hours())
        .minutes(time.minutes())
        .seconds(0);

      delete body.time;

      return body;

    default:
      return {};
  }
}

/**
 * The API request ended successfully
 *
 * @param {ActionType} actionType
 * @param {object|array} resp
 * @returns {{type: string,
 * msg:string|undefined,
 * token: string|undefined,
 * expense: Expense|undefined,
 * expenses: Expense[]|undefined}}
 */
function requestSucceeded(actionType, resp) {
  const msg = MODAL_MESSAGES[actionType];

  // the action to be dispatched is the SUCCESS version of the current request
  const type = actionType + SUCCESS;

  switch (actionType) {
    case REGISTRATION_REQUEST:
    case LOGIN_REQUEST:
      return { type, msg, token: resp.token };

    case CREATE_EXPENSE_REQUEST:
      return { type, msg, expense: resp };

    case GET_EXPENSES_REQUEST:
      return { type, expenses: resp };

    case DELETE_EXPENSE_REQUEST:
      return { type, msg };
  }
}

/**
 * The API request ended in an error
 *
 * @param {ActionType} type
 * @param {string} msg
 * @returns {{type: string, msg: string}}
 */
function requestFailed(type, msg) {
  // the action to be dispatched is the ERROR version of the current request
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

export default sendRequest;
