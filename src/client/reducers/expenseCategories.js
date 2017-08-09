import normalize, { addEntity } from 'utils/normalize';
import {
  SUCCESS,
  CREATE_EXPENSE_CATEGORY_REQUEST,
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

// @todo add reducer test
function expenseCategories(state = initialState, action) {
  switch (action.type) {
    case CREATE_EXPENSE_CATEGORY_REQUEST + SUCCESS:
      return Object.assign({}, addEntity(state, action.category));

    case GET_EXPENSE_CATEGORIES_REQUEST + SUCCESS:
      return Object.assign({}, normalize(action.categories));

    case LOG_OUT:
      return initialState;

    default:
      return state;
  }
}

export default expenseCategories;
