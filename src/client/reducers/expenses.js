import moment from 'moment';
import merge from 'lodash/merge';
import sortBy from 'lodash/sortBy';

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
 * @property {ObjectId[]} expenseIds
 * @property {ExpensesById} expensesById
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
  expenseIds: [],
  expensesById: {},
  expenseIdToDelete: null,
  expenseIdOnEdition: null,
};

/**
 * Add an expense to the expenseIds array and the expensesById object
 *
 * @param {Expense} obj
 * @param {ObjectId[]} expenseIdsArr
 * @param {ExpensesById} expensesByIdObj
 * @return {{expenseIds: ObjectId[], expensesById: ExpensesById}}
 */
function addExpense(obj, expenseIdsArr, expensesByIdObj) {
  const expense = merge({}, obj);
  const { id } = expense;

  delete expense.id;

  const expenseIds = expenseIdsArr.slice();
  expenseIds.push(id);

  const expensesById = merge({}, expensesByIdObj, { [id]: expense });

  return { expenseIds, expensesById };
}

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
      const expense = merge({}, state.expensesById[action.expenseId]);

      const date = moment(expense.date);
      const time = moment(expense.date);
      const { description, amount, comment } = expense;

      return Object.assign({}, state, {
        expenseIdOnEdition: action.expenseId,
        edit: { date, time, description, amount, comment },
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
      const newExpenses = addExpense(
        action.expense,
        state.expenseIds,
        state.expensesById
      );

      const { expensesById } = newExpenses;

      // sort by descending date
      const expenseIds = sortBy(newExpenses.expenseIds, id => expensesById[id].date)
        .reverse();

      // merge initial state to prevent mutations
      const create = initialState.create;

      return Object.assign({}, state, {
        create,
        expenseIds,
        expensesById,
      });
    }

    case GET_EXPENSES_REQUEST + SUCCESS: {
      const { expenseIds, expensesById } = action.expenses.reduce(
        (result, expense) => addExpense(expense, result.expenseIds, result.expensesById),
        { expenseIds: [], expensesById: {} }
      );

      return Object.assign({}, state, {
        expenseIds,
        expensesById,
      });
    }

    case DELETE_EXPENSE_REQUEST + SUCCESS: {
      // remove the deleted expense from cloned state objects
      const index = state.expenseIds.indexOf(state.expenseIdToDelete);

      const expenseIds = state.expenseIds.slice(0, index)
        .concat(state.expenseIds.slice(index + 1));

      const expensesById = merge({}, state.expensesById);

      delete expensesById[state.expenseIdToDelete];

      return Object.assign({}, state, {
        expenseIds,
        expensesById,
        expenseIdToDelete: null,
      });
    }

    case EDIT_EXPENSE_REQUEST + SUCCESS: {
      // merge the edit object to store it on expensesById
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
      const unsortedIds = state.expenseIds.slice();
      const expensesById = merge({}, state.expensesById);

      // add the new expense
      expensesById[state.expenseIdOnEdition] = expense;

      // sort by descending date
      const expenseIds = sortBy(unsortedIds, id => expensesById[id].date)
        .reverse();

      // merge initial state to prevent mutations
      const edit = initialState.edit;

      return Object.assign({}, state, {
        expenseIdOnEdition: null,
        edit,
        expenseIds,
        expensesById,
      });
    }

    default:
      return state;
  }
}

export { initialState };
export default expenses;
