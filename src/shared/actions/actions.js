import 'whatwg-fetch';
import hashHistory from 'react-router/lib/hashHistory';

import objToQueryString from 'utils/objToQueryString';

import {
  INPUT_CHANGE,
  REGISTRATION_REQUEST_ERR,
  REGISTRATION_REQUEST_SUCC,
  LOGIN_REQUEST_ERR,
  LOGIN_REQUEST_SUCC,
  CLOSE_MODAL
} from 'constants/actionTypes';
import { MODAL_REGISTRATION_SUCC, MODAL_LOGIN_SUCC } from 'constants/messages';

/**
 * Change event on one of the login/register forms' inputs
 *
 * @param {string} id - ID belonging to a form input with the format "formName_fieldName"
 * @param {string} value - value on the input
 * @returns {{type: string, id: string, value: string}}
 */
function inputChange(id, value) {
  return {
    type: INPUT_CHANGE,
    id,
    value,
  };
}

/**
 * A request of the given type has been sent to the API
 *
 * @param {string} type
 * @returns {{type: string}}
 */
function initRequest(type) {
  return { type };
}

/**
 * Send a user registration or login request to the API
 *
 * @param {('register'|'login')} type
 * @returns {function: (Promise)} If it worked, dispatch the token found on the response object,
 * or the error message. If it was rejected, dispatch an error message.
 */
function sendRequest(type) {
  const uri = '/api/users' + (type === 'login' ? '/login' : '');

  return (dispatch, getState) => fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: objToQueryString(getState().authenticated[type]),
  }).then(
    response => response.json().then(
      resp => {
        if (response.status === 201) {
          return dispatch(requestSucceeded(type, resp.token));
        }

        return dispatch(requestFailed(type, resp.msg));
      },

      rejected => dispatch(internalError(type))
    ),

    rejected => dispatch(internalError(type))
  );
}

/**
 * The registration or login request ended successfully
 *
 * @param {('register'|'login')} type
 * @param {string} token
 * @returns {{type: string, msg:string, token: string}}
 */
function requestSucceeded(type, token) {
  return {
    type: type === 'login' ? LOGIN_REQUEST_SUCC : REGISTRATION_REQUEST_SUCC,
    msg: type === 'login' ? MODAL_LOGIN_SUCC : MODAL_REGISTRATION_SUCC,
    token,
  };
}

/**
 * The registration or login request ended in an error
 *
 * @param {('register'|'login')} type
 * @param {string} msg
 * @returns {{type: string, msg: string}}
 */
function requestFailed(type, msg) {
  return {
    type: type === 'login' ? LOGIN_REQUEST_ERR : REGISTRATION_REQUEST_ERR,
    msg,
  };
}

/**
 * Handle request failure when the promises have been rejected for unexpected reasons (network
 * error, JSON parse unexpected chars...)
 *
 * @param {('register'|'login')} type
 * @returns {{type: string, msg: string}}
 */
function internalError(type) {
  return requestFailed(
    type,
    'something wrong happened, please try again later'
  );
}

/**
 * Handle the click of the button on the modal dialog, checking if the state requires a navigation
 * to another page before closing the dialog
 *
 * @returns {function}
 */
function modalBtnClick() {
  return (dispatch, getState) => {
    const modalMsg = getState().authenticated.modal.msg;

    if ([MODAL_REGISTRATION_SUCC, MODAL_LOGIN_SUCC].includes(modalMsg)) {
      hashHistory.push('/');
    }

    return dispatch(closeModal());
  };
}

/**
 * Close modal dialog
 *
 * @returns {{type: string}}
 */
function closeModal() {
  return { type: CLOSE_MODAL };
}

export {
  inputChange,
  initRequest,
  sendRequest,
  modalBtnClick,
  closeModal
};
