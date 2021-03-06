import merge from 'lodash/merge';

import {
  REQUEST,
  ERROR,
  SUCCESS,
  CLOSE_MODAL,
  LOG_OUT,
  OPEN_INPUT_MODAL,
  MODAL_INPUT_CHANGE,
  CREATE_EXPENSE_CATEGORY_REQUEST,
} from 'constants/actionTypes';

/**
 * State of the modal dialog where the user can input data
 *
 * @typedef {object} InputModalState
 * @property {boolean} isOpen
 * @property {string} msg
 * @property {string} inputValue
 */

/**
 * State of the modal dialog that shows success/error messages
 *
 * @typedef {object} MsgModalState
 * @property {boolean} isOpen
 * @property {?string} msg
 */

/**
 * @typedef {object} ModalsState
 * @property {InputModalState} inputModal
 * @property {MsgModalState} msgModal
 */

/**
 * @type {ModalsState}
 */
const initialState = {
  inputModal: {
    isOpen: false,
    msg: 'Insert the title for the new category',
    inputValue: '',
  },
  msgModal: {
    isOpen: false,
    msg: null,
  },
};

const reqErrRegex = new RegExp(`${REQUEST}${ERROR}$`);
// match any request success that does not start with "GET_EXPENSE" (GET expenses and categories)
const reqSucRegex = new RegExp(`^(?!GET_EXPENSE).*${REQUEST}${SUCCESS}$`);

function modals(state = initialState, action) {
  if (reqErrRegex.test(action.type) || reqSucRegex.test(action.type)) {
    return merge({}, state, {
      msgModal: { isOpen: true, msg: action.msg },
      inputModal: { inputValue: '' },
    });
  }

  switch (action.type) {
    case OPEN_INPUT_MODAL:
      return merge({}, state, {
        inputModal: { isOpen: true, inputValue: '' },
      });

    case MODAL_INPUT_CHANGE:
      return merge({}, state, {
        inputModal: { inputValue: action.value },
      });

    case CREATE_EXPENSE_CATEGORY_REQUEST:
      return merge({}, state, {
        inputModal: { isOpen: false },
      });

    case CLOSE_MODAL:
    case LOG_OUT:
      return merge({}, initialState);

    default:
      return state;
  }
}

export { initialState };
export default modals;
