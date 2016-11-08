import merge from 'lodash/merge';

import {
  INPUT_CHANGE,
  REGISTRATION_REQUEST,
  REGISTRATION_REQUEST_ERR,
  REGISTRATION_REQUEST_SUCC,
  CLOSE_MODAL,
  LOG_IN,
  LOG_OUT
} from 'constants/actionTypes';

const initialState = {
  id: null,
  token: null,
  register: {
    name: '',
    mail: '',
    password: '',
  },
  login: {
    mail: '',
    password: '',
  },
  isFetching: false,
  modal: {
    isOpen: false,
    msg: null,
  },
};

function authenticated(state = initialState, action) {
  switch (action.type) {
    case INPUT_CHANGE:
      const [form, field] = action.id.split('_');

      return merge({}, state, {
        [form]: { [field]: action.value },
      });

    case REGISTRATION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case REGISTRATION_REQUEST_ERR:
      return merge({}, state, {
        isFetching: false,
        modal: { isOpen: true, msg: action.msg },
      });

    case REGISTRATION_REQUEST_SUCC:
      return merge({}, state, {
        isFetching: false,
        id: action.id,
        token: action.token,
        modal: { isOpen: true, msg: 'registration successful' },
      });

    case CLOSE_MODAL:
      return merge({}, state, {
        modal: { isOpen: false, msg: null },
      });

    case LOG_OUT:
      return initialState;

    case LOG_IN:
      return {
        id: action.id,
        token: action.token,
      };

    default:
      return state;
  }
}

export { initialState };
export default authenticated;
