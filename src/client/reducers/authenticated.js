import merge from 'lodash/merge';

import MODAL_MESSAGES from 'constants/messages';
import {
  LOGIN_REGISTRATION_INPUT_CHANGE,
  SESSION_EXPIRED,
  LOG_OUT,
  REGISTRATION_REQUEST_SUCC,
  LOGIN_REQUEST_SUCC,
  CREATE_EXPENSE_REQUEST_ERR,
  GET_EXPENSES_REQUEST_ERR,
  EDIT_EXPENSE_REQUEST_ERR,
  DELETE_EXPENSE_REQUEST_ERR,
} from 'constants/actionTypes';

/**
 * @typedef {object} RegistrationState
 * @property {string} name
 * @property {string} mail
 * @property {string} password
 */

/**
 * @typedef {object} LoginState
 * @property {string} mail
 * @property {string} password
 */

/**
 * @typedef {object} AuthenticatedState
 * @property {?string} token
 * @property {RegistrationState} registration
 * @property {LoginState} login
 */

/**
 * @type {AuthenticatedState}
 */
const initialState = {
  token: null,
  registration: {
    name: '',
    mail: '',
    password: '',
  },
  login: {
    mail: '',
    password: '',
  },
};

function authenticated(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REGISTRATION_INPUT_CHANGE: {
      const { form, field, value } = action;

      return merge({}, state, {
        [form]: { [field]: value },
      });
    }

    case REGISTRATION_REQUEST_SUCC:
    case LOGIN_REQUEST_SUCC:
      return Object.assign({}, {
        registration: initialState.registration,
        login: initialState.login,
        token: action.token,
      });

    case CREATE_EXPENSE_REQUEST_ERR:
    case GET_EXPENSES_REQUEST_ERR:
    case EDIT_EXPENSE_REQUEST_ERR:
    case DELETE_EXPENSE_REQUEST_ERR:
      if (action.msg !== MODAL_MESSAGES[SESSION_EXPIRED]) {
        return state;
      }

      return Object.assign({}, state, {
        token: null,
      });

    case SESSION_EXPIRED:
    case LOG_OUT:
      return Object.assign({}, state, {
        token: null,
      });

    default:
      return state;
  }
}

export { initialState };
export default authenticated;
