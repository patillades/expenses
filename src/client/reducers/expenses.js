import moment from 'moment';
import merge from 'lodash/merge';
import sortBy from 'lodash/sortBy';

import normalize, { addEntity } from 'utils/normalize';
import {
  ERROR,
  SUCCESS,
  EXPENSE_DATE_CHANGE,
  EXPENSE_TIME_CHANGE,
  EXPENSES_INPUT_CHANGE,
  CREATE_EXPENSE_REQUEST,
  GET_EXPENSES_REQUEST,
  DELETE_EXPENSE_REQUEST,
  EDIT_EXPENSE,
  CANCEL_EDIT_EXPENSE,
  EDIT_EXPENSE_REQUEST,
  CHANGE_CATEGORY_EXPENSE,
} from 'constants/actionTypes';

/**
 * @typedef {object} CreateExpenseState
 * @property {MomentDate} date
 * @property {MomentDate} time
 * @property {string} description
 * @property {number} amount
 * @property {string} comment
 * @property {string} expenseCategoryId
 */

/**
 * @typedef {object} Expense
 * @property {ObjectId} id
 * @property {string} date
 * @property {string} description
 * @property {number} amount
 * @property {string|undefined} comment
 */

/**
 * @typedef {object.<ObjectId, Expense>} ExpensesById
 */

/**
 * @typedef {object} ExpensesState
 * @property {CreateExpenseState} create
 * @property {CreateExpenseState} edit
 * @property {ObjectId[]} ids
 * @property {ExpensesById} byId
 * @property {?ObjectId} expenseIdToDelete
 * @property {?ObjectId} expenseIdOnEdition
 */

/**
 * @type {ExpensesState}
 */
const initialState = {
  create: {
    date: moment(),
    time: moment().hours(0).minutes(0),
    description: '',
    amount: '',
    comment: '',
    expenseCategoryId: '',
  },
  edit: {
    date: moment(),
    time: moment().hours(0).minutes(0),
    description: '',
    amount: '',
    comment: '',
    expenseCategoryId: '',
  },
  ids: [],
  byId: {},
  expenseIdToDelete: null,
  expenseIdOnEdition: null,
};

function expenses(state = initialState, action) {
  switch (action.type) {
    case EXPENSE_DATE_CHANGE:
      return merge({}, state, {
        [action.form]: { date: action.date },
      });

    case EXPENSE_TIME_CHANGE:
      return merge({}, state, {
        [action.form]: { time: action.date },
      });

    case EXPENSES_INPUT_CHANGE:
    case CHANGE_CATEGORY_EXPENSE: {
      const { form, field, value } = action;

      return merge({}, state, {
        [form]: { [field]: value },
      });
    }

    case EDIT_EXPENSE: {
      // merge the expense to edit to prevent mutations
      const expense = merge({}, state.byId[action.expenseId]);

      const date = moment(expense.date);
      const time = moment(expense.date);
      const { description, amount, comment } = expense;
      const expenseCategoryId = expense.hasOwnProperty('expenseCategoryId')
        ? expense.expenseCategoryId
        : '';

      return Object.assign({}, state, {
        expenseIdOnEdition: action.expenseId,
        edit: { date, time, description, amount, comment, expenseCategoryId },
      });
    }

    case CANCEL_EDIT_EXPENSE:
      return merge({}, state, {
        expenseIdOnEdition: null,
        edit: initialState.edit,
      });

    case DELETE_EXPENSE_REQUEST:
      return Object.assign({}, state, {
        expenseIdToDelete: action.data.expenseId,
      });

    case DELETE_EXPENSE_REQUEST + ERROR:
      return Object.assign({}, state, {
        expenseIdToDelete: null,
      });

    case CREATE_EXPENSE_REQUEST + SUCCESS: {
      // add the created expense
      const newExpenses = addEntity(state, action.data);

      const { byId } = newExpenses;

      // sort by descending date
      const ids = sortBy(newExpenses.ids, id => byId[id].date)
        .reverse();

      // merge initial state to prevent mutations
      const create = initialState.create;

      return Object.assign({}, state, {
        create,
        ids,
        byId,
      });
    }

    case GET_EXPENSES_REQUEST + SUCCESS: {
      return Object.assign({}, state, normalize(action.data));
    }

    case DELETE_EXPENSE_REQUEST + SUCCESS: {
      // remove the deleted expense from cloned state objects
      const index = state.ids.indexOf(state.expenseIdToDelete);

      const ids = state.ids.slice(0, index)
        .concat(state.ids.slice(index + 1));

      const byId = merge({}, state.byId);

      delete byId[state.expenseIdToDelete];

      return Object.assign({}, state, {
        ids,
        byId,
        expenseIdToDelete: null,
      });
    }

    case EDIT_EXPENSE_REQUEST + SUCCESS: {
      // merge the edit object to store it on byId
      const expense = merge({}, state.edit);

      // cast amount to number so it doesn't cause issues when calculating weekly totals
      expense.amount = Number(expense.amount);

      // set the time on the MomentDate date property, and format to string like the expenses sent
      // by API
      const { time } = expense;

      // time can be null if the user clicks on the "X" that closes the timepicker
      if (time) {
        expense.date
          .hours(time.hours())
          .minutes(time.minutes())
          .seconds(0);
      }

      expense.date = expense.date.format();

      delete expense.time;

      // clone the state objects
      const unsortedIds = state.ids.slice();
      const byId = merge({}, state.byId);

      // add the new expense
      byId[state.expenseIdOnEdition] = expense;

      // sort by descending date
      const ids = sortBy(unsortedIds, id => byId[id].date)
        .reverse();

      // merge initial state to prevent mutations
      const edit = initialState.edit;

      return Object.assign({}, state, {
        expenseIdOnEdition: null,
        edit,
        ids,
        byId,
      });
    }

    default:
      return state;
  }
}

export { initialState };
export default expenses;
