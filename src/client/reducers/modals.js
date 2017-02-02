import merge from 'lodash/merge';

import {
  OPEN_INPUT_MODAL,
  MODAL_INPUT_CHANGE,
  CREATE_CATEGORY_REQUEST,
} from 'constants/actionTypes';

const initialState = {
  inputModal: {
    isOpen: false,
    msg: 'Insert the title for the new category',
    inputValue: '',
  },
};

function modals(state = initialState, action) {
  switch (action.type) {
    case OPEN_INPUT_MODAL:
      return merge({}, state, {
        inputModal: { isOpen: true },
      });

    case MODAL_INPUT_CHANGE:
      return merge({}, state, {
        inputModal: { inputValue: action.value },
      });

    case CREATE_CATEGORY_REQUEST:
      return merge({}, state, {
        inputModal: { isOpen: false },
      });

    default:
      return state;
  }
}

export default modals;
