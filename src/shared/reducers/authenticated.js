import merge from 'lodash/merge';

import {
  LOGIN_REGISTRATION_INPUT_CHANGE,
  REGISTRATION_REQUEST_SUCC,
  LOGIN_REQUEST_SUCC,
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
    case LOGIN_REGISTRATION_INPUT_CHANGE:
      const { form, field, value } = action;

      return merge({}, state, {
        [form]: { [field]: value },
      });

    case REGISTRATION_REQUEST_SUCC:
    case LOGIN_REQUEST_SUCC:
      return Object.assign({}, {
        registration: initialState.registration,
        login: initialState.login,
        token: action.token,
      });

    default:
      return state;
  }
}

export { initialState };
export default authenticated;
