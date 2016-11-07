import merge from 'lodash/merge';

import { INPUT_CHANGE, LOG_IN, LOG_OUT } from 'constants/actionTypes';

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
};

function authenticated(state = initialState, action) {
  switch (action.type) {
    case LOG_OUT:
      return initialState;

    case LOG_IN:
      return {
        id: action.id,
        token: action.token,
      };

    case INPUT_CHANGE:
      const [form, field] = action.id.split('_');

      return merge({}, state, {
        [form]: { [field]: action.value },
      });

    default:
      return state;
  }
}

export { initialState };
export default authenticated;
