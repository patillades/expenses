import 'whatwg-fetch';
import hashHistory from 'react-router/lib/hashHistory';
import jwtDecode from 'jwt-decode';

import objToQueryString from 'utils/objToQueryString';

import {
  INPUT_CHANGE,
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
  CLOSE_MODAL
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
  },
};

/**
 * Types of actions that can initializa an API call
 *
 * @typedef {('registration'|'login'|'create_expense')} ActionType
 */

/**
 * Get the API endpoint URI related to the given action type
 *
 * @param {ActionType} type
 * @returns {string}
 */
function getActionTypeUri(type) {
  switch (type) {
    case REGISTRATION:
      return '/api/users';

    case LOGIN:
      return '/api/users/login';

    case CREATE_EXPENSE:
      const token = localStorage.getItem('token');
      const decoded = token
        ? jwtDecode(localStorage.getItem('token'))
        : { sub: '' };

      return `/api/users/${decoded.sub}/expenses`;
  }
}

/**
 * Change event on a form input
 *
 * @param {string} id - ID belonging to a form input
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
 * @param {ActionType} type
 * @returns {function: (Promise)} If it worked, dispatch the token found on the response object,
 * or the error message. If it was rejected, dispatch an error message.
 */
function sendRequest(type) {
  return (dispatch, getState) => {
    const token = localStorage.getItem('token');

    return fetch(getActionTypeUri(type), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token ? ('Bearer ' + token) : null,
      },
      body: objToQueryString(getBodyObj(type, getState())),
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
  };
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
      return state.expenses.create;
  }

}

/**
 * The registration or login request ended successfully
 *
 * @param {ActionType} type
 * @param {string} token
 * @returns {{type: string, msg:string, token: string}}
 */
function requestSucceeded(type, token) {
  return {
    type: actionTypeConstants.requestSucc.type[type],
    msg: actionTypeConstants.requestSucc.msg[type],
    token,
  };
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

/**
 * Date object generated by the moment module
 *
 * @typedef {object} MomentDate
 */

/**
 * The date selected on the date or time pickers used to create expenses has been changed
 *
 * @param {string} type
 * @param {MomentDate} date
 * @returns {{type: string, date: MomentDate}}
 */
function createExpenseDatetimeChange(type, date) {
  return {
    type,
    date,
  };
}

export {
  inputChange,
  initRequest,
  sendRequest,
  modalBtnClick,
  closeModal,
  createExpenseDatetimeChange
};
