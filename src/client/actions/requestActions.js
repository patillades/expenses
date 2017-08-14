import fetch from 'isomorphic-fetch';

import apiData from 'requests/apiData';
import requestBody from 'requests/requestBody';
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
  const { uri, method } = apiData(type, state, userId);

  const options = {
    method,
    headers: {
      Authorization: token ? (`Bearer ${token}`) : null,
    },
  };

  if (['POST', 'PUT'].includes(method)) {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    options.body = objToQueryString(requestBody(type, state));
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
