import merge from 'lodash/merge';

import {
  LOGIN_REGISTRATION_INPUT_CHANGE,
  REGISTRATION_REQUEST,
  REGISTRATION_REQUEST_ERR,
  REGISTRATION_REQUEST_SUCC,
  LOGIN_REQUEST,
  LOGIN_REQUEST_ERR,
  LOGIN_REQUEST_SUCC,
  CLOSE_MODAL
} from 'constants/actionTypes';

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
  isFetching: false,
  triggerId: null,
  modal: {
    isOpen: false,
    msg: null,
  },
};

function authenticated(state = initialState, action) {
  switch (action.type) {
    case CLOSE_MODAL:
      return Object.assign({}, state, {
        modal: { isOpen: false, msg: null },
      });

    case LOGIN_REGISTRATION_INPUT_CHANGE:
      const { form, field, value } = action;

      return merge({}, state, {
        [form]: { [field]: value },
      });

    case REGISTRATION_REQUEST:
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        triggerId: action.data.triggerId,
      });

    case REGISTRATION_REQUEST_ERR:
    case LOGIN_REQUEST_ERR:
      return Object.assign({}, state, {
        isFetching: false,
        triggerId: null,
        modal: { isOpen: true, msg: action.msg },
      });

    case REGISTRATION_REQUEST_SUCC:
    case LOGIN_REQUEST_SUCC:
      return Object.assign({}, {
        registration: initialState.registration,
        login: initialState.login,
        isFetching: false,
        triggerId: null,
        token: action.token,
        modal: { isOpen: true, msg: action.msg },
      });

    default:
      return state;
  }
}

export { initialState };
export default authenticated;
