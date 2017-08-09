import normalize from 'utils/normalize';
import {
  SUCCESS,
  GET_EXPENSE_CATEGORIES_REQUEST,
  LOG_OUT,
} from 'constants/actionTypes';

/**
 * @typedef {object} ExpenseCategory
 * @property {ObjectId} id
 * @property {string} title
 */

/**
 * @typedef {object.<ObjectId, ExpenseCategory>} ExpenseCategoriesById
 */

/**
 * @typedef {object} ExpenseCategoriesState
 * @property {ObjectId[]} ids
 * @property {ExpenseCategoriesById} byId
 */

/**
 * @type {ExpenseCategoriesState}
 */
const initialState = {
  ids: [],
  byId: {},
};

function expenseCategories(state = initialState, action) {
  switch (action.type) {
    case GET_EXPENSE_CATEGORIES_REQUEST + SUCCESS:
      return Object.assign({}, state, normalize(action.categories));

    case LOG_OUT:
      return initialState;

    default:
      return state;
  }
}

export default expenseCategories;
