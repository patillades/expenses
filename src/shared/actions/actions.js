import 'whatwg-fetch';

import objToQueryString from 'utils/objToQueryString';

import {
  INPUT_CHANGE,
  REGISTRATION_REQUEST,
  REGISTRATION_REQUEST_ERR,
  CLOSE_MODAL
} from 'constants/actionTypes';

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
 * A user registration request has been sent to the API
 *
 * @returns {{type: string}}
 */
function registrationRequest() {
  return { type: REGISTRATION_REQUEST };
}

/**
 * Send a user registration request to the API
 *
 * @returns {function: (Promise<Response>|Promise.<{msg: string}>)}
 */
function registerUser() {
  return (dispatch, getState) => fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: objToQueryString(getState().authenticated.register),
  }).then(
    response => {
      if (response.status === 200) {
        return;
      }

      return response.json().then(
        resp => dispatch(registrationRequestErr(resp.msg))
      );
    }
  );
}

/**
 * The registration request ended in an error
 *
 * @param {string} msg
 * @returns {{type: string, msg: string}}
 */
function registrationRequestErr(msg) {
  return {
    type: REGISTRATION_REQUEST_ERR,
    msg,
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
  registrationRequest,
  registerUser,
  closeModal
};
