import 'whatwg-fetch';
import hashHistory from 'react-router/lib/hashHistory';

import objToQueryString from 'utils/objToQueryString';

import {
  INPUT_CHANGE,
  REGISTRATION_REQUEST,
  REGISTRATION_REQUEST_ERR,
  REGISTRATION_REQUEST_SUCC,
  CLOSE_MODAL
} from 'constants/actionTypes';
import { MODAL_REGISTRATION_SUCC } from 'constants/messages';

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
    response => response.json().then(
      resp => {
        if (response.status === 201) {
          return dispatch(registrationRequestSucc(resp));
        }

        return dispatch(registrationRequestErr(resp.msg));
      }
    ),

    rejected => dispatch(registrationRequestErr(
      'something wrong happened, please try again later'
    ))
  );
}

/**
 * The registration request ended successfully
 *
 * @param {{id: string, token: string}} user
 * @returns {{type: string, id: string, token: string}}
 */
function registrationRequestSucc(user) {
  const { id, token } = user;

  return {
    type: REGISTRATION_REQUEST_SUCC,
    id,
    token,
  };
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
 * Handle the click of the button on the modal dialog, checking if the state requires a navigation
 * to another page before closing the dialog
 *
 * @returns {function}
 */
function modalBtnClick() {
  return (dispatch, getState) => {
    const state = getState();

    if (state.authenticated.modal.msg === MODAL_REGISTRATION_SUCC) {
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
  registrationRequest,
  registerUser,
  modalBtnClick,
  closeModal
};
