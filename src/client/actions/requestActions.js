import jwtDecode from 'jwt-decode';

import objToQueryString from 'utils/objToQueryString';
import MODAL_MESSAGES from 'constants/messages';
import {
  ERROR,
  SUCCESS,
  SESSION_EXPIRED,
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  CREATE_EXPENSE_REQUEST,
  GET_EXPENSES_REQUEST,
  DELETE_EXPENSE_REQUEST,
  EDIT_EXPENSE_REQUEST,
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
 * |DELETE_EXPENSE_REQUEST
 * |EDIT_EXPENSE_REQUEST)} ActionType
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
 * The user's token has expired
 *
 * @return {{type: string, msg: string}}
 */
function sessionExpired() {
  return {
    type: SESSION_EXPIRED,
    msg: MODAL_MESSAGES[SESSION_EXPIRED],
  };
}

/**
 * Get the API endpoint URI related to the given action type
 *
 * @param {ActionType} type
 * @param {object} state - The state of redux's store
 * @param {?ObjectId} userId
 * @returns {string}
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
  }
}

/**
 * Get the request body for create/edit requests
 *
 * @param {CreateExpenseState} expenseData
 * @return {{date: MomentDate, description: string, amount: number, comment: string }}
 */
function getCreateOrEditExpenseBody(expenseData) {
  const body = Object.assign({}, expenseData);
  const { time } = body;

  body.date
    .hours(time.hours())
    .minutes(time.minutes())
    .seconds(0);

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
 * @return {Promise}
 */
function fetchRequest(type, state, token, userId) {
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

  return fetch(uri, options);
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

    default:
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

    const state = getState();
    const { token } = state.authenticated;

    let userId = null;

    // when the request needs the user's id, attempt to get it from token and dispatch a
    // sessionExpired action if there's an exception so the token is cleared from localStorage and
    // the user logs in again
    if (
      [
        CREATE_EXPENSE_REQUEST,
        GET_EXPENSES_REQUEST,
        DELETE_EXPENSE_REQUEST,
        EDIT_EXPENSE_REQUEST,
      ].includes(type)
    ) {
      try {
        userId = jwtDecode(token).sub;
      } catch (e) {
        return dispatch(sessionExpired());
      }
    }

    fetchRequest(type, state, token, userId).then(
      (response) => {
        // 204 (no content) comes without a body and JSON parsing woul throw an error
        const bodyData = response.status === 204 ? 'text' : 'json';

        response[bodyData]().then(
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

export { sessionExpired };
export default sendRequest;