import merge from 'lodash/merge';

import {
  INPUT_CHANGE,
  REGISTRATION_REQUEST,
  REGISTRATION_REQUEST_ERR,
  REGISTRATION_REQUEST_SUCC,
  CLOSE_MODAL
} from 'constants/actionTypes';
import { MODAL_REGISTRATION_SUCC } from 'constants/messages';

const initialState = {
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
        token: action.token,
        modal: { isOpen: true, msg: MODAL_REGISTRATION_SUCC },
      });

    case CLOSE_MODAL:
      return merge({}, state, {
        modal: { isOpen: false, msg: null },
      });

    default:
      return state;
  }
}

export { initialState };
export default authenticated;
