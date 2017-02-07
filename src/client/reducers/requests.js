import {
  ERROR,
  SUCCESS,
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
  CREATE_CATEGORY_REQUEST,
} from 'constants/actionTypes';

/**
 * @typedef {object} RequestsState
 * @property {boolean} isFetching
 * @property {?string} triggerId - Id of the element that triggered the API request
 */

/**
 * @type {RequestsState}
 */
const initialState = {
  isFetching: false,
  triggerId: null,
};

function requests(state = initialState, action) {
  switch (action.type) {
    case REGISTRATION_REQUEST:
    case LOGIN_REQUEST:
    case CREATE_EXPENSE_REQUEST:
    case EDIT_EXPENSE_REQUEST:
    case GET_EXPENSES_REQUEST:
    case DELETE_EXPENSE_REQUEST:
    case CREATE_CATEGORY_REQUEST:
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
    case CREATE_CATEGORY_REQUEST + ERROR:
    case CREATE_CATEGORY_REQUEST + SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        triggerId: null,
      });

    case GET_EXPENSES_REQUEST_SUCC:
      return Object.assign({}, state, {
        isFetching: false,
        triggerId: null,
      });

    default:
      return state;
  }
}

export default requests;
