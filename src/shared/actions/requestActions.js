import jwtDecode from 'jwt-decode';

import objToQueryString from 'utils/objToQueryString';
import {
  REGISTRATION,
  REGISTRATION_REQUEST,
  REGISTRATION_REQUEST_ERR,
  REGISTRATION_REQUEST_SUCC,
  LOGIN,
  LOGIN_REQUEST,
  LOGIN_REQUEST_ERR,
  LOGIN_REQUEST_SUCC,
  CREATE_EXPENSE,
  CREATE_EXPENSE_REQUEST_ERR,
  CREATE_EXPENSE_REQUEST_SUCC,
  GET_EXPENSES,
  GET_EXPENSES_REQUEST_ERR,
  GET_EXPENSES_REQUEST_SUCC
} from 'constants/actionTypes';
import {
  MODAL_REGISTRATION_SUCC,
  MODAL_LOGIN_SUCC,
  MODAL_CREATE_EXPENSE_SUCC
} from 'constants/messages';

const actionTypeConstants = {
  requestSucc: {
    type: {
      [REGISTRATION]: REGISTRATION_REQUEST_SUCC,
      [LOGIN]: LOGIN_REQUEST_SUCC,
      [CREATE_EXPENSE]: CREATE_EXPENSE_REQUEST_SUCC,
      [GET_EXPENSES]: GET_EXPENSES_REQUEST_SUCC,
    },
    msg: {
      [REGISTRATION]: MODAL_REGISTRATION_SUCC,
      [LOGIN]: MODAL_LOGIN_SUCC,
      [CREATE_EXPENSE]: MODAL_CREATE_EXPENSE_SUCC,
    },
  },
  requestErrType: {
    [REGISTRATION]: REGISTRATION_REQUEST_ERR,
    [LOGIN]: LOGIN_REQUEST_ERR,
    [CREATE_EXPENSE]: CREATE_EXPENSE_REQUEST_ERR,
    [GET_EXPENSES]: GET_EXPENSES_REQUEST_ERR,
  },
};

const successStatus = /^2\d{2}$/;

/**
 * Types of actions that can initialize an API call
 *
 * @typedef {(REGISTRATION|LOGIN|CREATE_EXPENSE|GET_EXPENSES)} ActionType
 */

/**
 * Send a user registration or login request to the API
 *
 * @param {ActionType} type
 * @returns {function: (Promise)} If it worked, dispatch the token found on the response object,
 * or the error message. If it was rejected, dispatch an error message.
 */
function sendRequest(type) {
  return (dispatch, getState) => fetchRequest(type, getState()).then(
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

/**
 * Fill the fetch request with the options associated to each action type
 *
 * @param {ActionType} type
 * @param {object} state - The state of redux's store
 * @return {Promise}
 */
function fetchRequest(type, state) {
  const { token } = state.authenticated;
  const { uri, method } = getActionTypeRequestData(type, token);

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
 * @param {?string} token
 * @returns {string}
 */
function getActionTypeRequestData(type, token) {
  switch (type) {
    case REGISTRATION:
      return {
        method: 'POST',
        uri: '/api/users',
      };

    case LOGIN:
      return {
        method: 'POST',
        uri: '/api/users/login',
      };

    case CREATE_EXPENSE:
      return {
        method: 'POST',
        uri: `/api/users/${getUserIdFromToken(token)}/expenses`,
      };

    case GET_EXPENSES:
      return {
        method: 'GET',
        uri: `/api/users/${getUserIdFromToken(token)}/expenses`,
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
 * Get the state object to be used as the body of an API request
 *
 * @param {ActionType} type
 * @param {object} state
 * @returns {object}
 */
function getBodyObj(type, state) {
  switch (type) {
    case REGISTRATION:
    case LOGIN:
      return state.authenticated[type];

    case CREATE_EXPENSE:
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
 * The registration or login request ended successfully
 *
 * @param {ActionType} type
 * @param {object} token
 * @returns {{type: string, msg:string, token: string}}
 */
function requestSucceeded(type, resp) {
  const successType = actionTypeConstants.requestSucc.type[type];

  switch (type) {
    case REGISTRATION:
    case LOGIN:
      return {
        type: successType,
        msg: actionTypeConstants.requestSucc.msg[type],
        token: resp.token,
      };

    case CREATE_EXPENSE:
      return {
        type: successType,
        msg: actionTypeConstants.requestSucc.msg[type],
        expense: resp,
      };

    case GET_EXPENSES:
      return {
        type: successType,
        expenses: resp,
      };
  }
}

/**
 * The registration or login request ended in an error
 *
 * @param {ActionType} type
 * @param {string} msg
 * @returns {{type: string, msg: string}}
 */
function requestFailed(type, msg) {
  return {
    type: actionTypeConstants.requestErrType[type],
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
