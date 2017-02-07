import {
  REQUEST,
  ERROR,
  SUCCESS,
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

const reqInitRegex = new RegExp(`${REQUEST}$`);
const reqEndRegex = new RegExp(`${REQUEST}(${ERROR}|${SUCCESS})$`);

function requests(state = initialState, action) {
  if (reqInitRegex.test(action.type)) {
    return Object.assign({}, state, {
      isFetching: true,
      triggerId: action.data.triggerId,
    });
  }

  if (reqEndRegex.test(action.type)) {
    return Object.assign({}, state, {
      isFetching: false,
      triggerId: null,
    });
  }

  return state;
}

export { initialState };
export default requests;
