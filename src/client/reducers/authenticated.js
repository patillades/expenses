import merge from 'lodash/merge';

import {
  SUCCESS,
  LOGIN_REGISTRATION_INPUT_CHANGE,
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  LOG_OUT,
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
 * @property {?ObjectId} id - User id, used to generate the API request's links
 * @property {?string} token
 * @property {RegistrationState} registration
 * @property {LoginState} login
 */

/**
 * @type {AuthenticatedState}
 */
const initialState = {
  id: null,
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

    case REGISTRATION_REQUEST + SUCCESS:
    case LOGIN_REQUEST + SUCCESS: {
      const { id, token } = action.data;

      return merge({}, initialState, { id, token });
    }

    case LOG_OUT:
      return merge({}, initialState);

    default:
      return state;
  }
}

export { initialState };
export default authenticated;
