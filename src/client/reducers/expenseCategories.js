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
 * @typedef {ExpenseCategory[]} ExpenseCategoriesState
 */

/**
 * @type {ExpenseCategoriesState}
 */
const initialState = [];

function expenseCategories(state = initialState, action) {
  switch (action.type) {
    case GET_EXPENSE_CATEGORIES_REQUEST + SUCCESS: {
      const { categories } = action;

      return categories;
    }

    case LOG_OUT:
      return initialState;

    default:
      return state;
  }
}

export default expenseCategories;
