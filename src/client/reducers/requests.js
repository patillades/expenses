import {
  SESSION_EXPIRED,
  REGISTRATION_REQUEST,
  REGISTRATION_REQUEST_ERR,
  REGISTRATION_REQUEST_SUCC,
  LOGIN_REQUEST,
  LOGIN_REQUEST_ERR,
  LOGIN_REQUEST_SUCC,
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_REQUEST_ERR,
  CREATE_EXPENSE_REQUEST_SUCC,
  GET_EXPENSES_REQUEST,
  GET_EXPENSES_REQUEST_ERR,
  GET_EXPENSES_REQUEST_SUCC,
  DELETE_EXPENSE_REQUEST,
  DELETE_EXPENSE_REQUEST_ERR,
  DELETE_EXPENSE_REQUEST_SUCC,
  EDIT_EXPENSE_REQUEST,
  EDIT_EXPENSE_REQUEST_ERR,
  EDIT_EXPENSE_REQUEST_SUCC,
  CLOSE_MODAL,
} from 'constants/actionTypes';

/**
 * @typedef {object} ModalState
 * @property {boolean} isOpen
 * @property {?string} msg
 */

/**
 * @typedef {object} RequestsState
 * @property {boolean} isFetching
 * @property {?string} triggerId - Id of the element that triggered the API request
 * @property {ModalState} modal
 */

/**
 * @type {RequestsState}
 */
const initialState = {
  isFetching: false,
  triggerId: null,
  modal: {
    isOpen: false,
    msg: null,
  },
};

function requests(state = initialState, action) {
  switch (action.type) {
    case REGISTRATION_REQUEST:
    case LOGIN_REQUEST:
    case CREATE_EXPENSE_REQUEST:
    case EDIT_EXPENSE_REQUEST:
    case GET_EXPENSES_REQUEST:
    case DELETE_EXPENSE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        triggerId: action.data.triggerId,
      });

    case REGISTRATION_REQUEST_ERR:
    case LOGIN_REQUEST_ERR:
    case REGISTRATION_REQUEST_SUCC:
    case LOGIN_REQUEST_SUCC:
    case CREATE_EXPENSE_REQUEST_ERR:
    case CREATE_EXPENSE_REQUEST_SUCC:
    case GET_EXPENSES_REQUEST_ERR:
    case EDIT_EXPENSE_REQUEST_ERR:
    case EDIT_EXPENSE_REQUEST_SUCC:
    case DELETE_EXPENSE_REQUEST_ERR:
    case DELETE_EXPENSE_REQUEST_SUCC:
    case SESSION_EXPIRED:
      return Object.assign({}, state, {
        isFetching: false,
        triggerId: null,
        modal: { isOpen: true, msg: action.msg },
      });

    case GET_EXPENSES_REQUEST_SUCC:
      return Object.assign({}, state, {
        isFetching: false,
        triggerId: null,
      });

    case CLOSE_MODAL:
      return Object.assign({}, state, {
        modal: { isOpen: false, msg: null },
      });

    default:
      return state;
  }
}

export default requests;
