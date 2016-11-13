import moment from 'moment';
import merge from 'lodash/merge';
import sortBy from 'lodash/sortBy';

import {
  EXPENSE_DATE_CHANGE,
  EXPENSE_TIME_CHANGE,
  EXPENSES_INPUT_CHANGE,
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_REQUEST_ERR,
  CREATE_EXPENSE_REQUEST_SUCC,
  GET_EXPENSES_REQUEST,
  GET_EXPENSES_REQUEST_ERR,
  GET_EXPENSES_REQUEST_SUCC,
  CLOSE_MODAL,
  DELETE_EXPENSE_REQUEST,
  DELETE_EXPENSE_REQUEST_ERR,
  DELETE_EXPENSE_REQUEST_SUCC,
  EDIT_EXPENSE,
  CANCEL_EDIT_EXPENSE,
  EDIT_EXPENSE_REQUEST,
  EDIT_EXPENSE_REQUEST_ERR,
  EDIT_EXPENSE_REQUEST_SUCC
} from 'constants/actionTypes';

/**
 * @typedef {object} CreateExpenseState
 * @property {MomentDate} date
 * @property {MomentDate} time
 * @property {string} description
 * @property {number} amount
 * @property {string} comment
 */

/**
 * @typedef {object} ModalState
 * @property {boolean} isOpen
 * @property {?string} msg
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
 * @property {boolean} isFetching
 * @property {?string} triggerId - Id of the element that triggered the API request
 * @property {ModalState} modal
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
  },
  edit: {
    date: moment(),
    time: moment().hours(0).minutes(0),
    description: '',
    amount: '',
    comment: '',
  },
  isFetching: false,
  triggerId: null,
  modal: {
    isOpen: false,
    msg: null,
  },
  expenseIds: [],
  expensesById: {},
  expenseIdToDelete: null,
  expenseIdOnEdition: null,
};

function expenses(state = initialState, action) {
  switch (action.type) {
    case CLOSE_MODAL:
      return Object.assign({}, state, {
        modal: { isOpen: false, msg: null },
      });

    case EXPENSE_DATE_CHANGE:
      return merge({}, state, {
        [action.form]: { date: action.date },
      });

    case EXPENSE_TIME_CHANGE:
      return merge({}, state, {
        [action.form]: { time: action.date },
      });

    case EXPENSES_INPUT_CHANGE:
      const { form, field, value } = action;

      return merge({}, state, {
        [form]: { [field]: value },
      });

    case EDIT_EXPENSE:
      {
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

    case CREATE_EXPENSE_REQUEST:
    case EDIT_EXPENSE_REQUEST:
    case GET_EXPENSES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        triggerId: action.data.triggerId,
      });

    case DELETE_EXPENSE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        triggerId: action.data.triggerId,
        expenseIdToDelete: action.data.expenseId,
      });

    case CREATE_EXPENSE_REQUEST_ERR:
    case GET_EXPENSES_REQUEST_ERR:
    case EDIT_EXPENSE_REQUEST_ERR:
      return Object.assign({}, state, {
        isFetching: false,
        triggerId: null,
        modal: { isOpen: true, msg: action.msg },
      });

    case DELETE_EXPENSE_REQUEST_ERR:
      return Object.assign({}, state, {
        isFetching: false,
        triggerId: null,
        modal: { isOpen: true, msg: action.msg },
        expenseIdToDelete: null,
      });

    case CREATE_EXPENSE_REQUEST_SUCC:
      {
        // clone the state objects to prevent mutations
        const unsortedIds = state.expenseIds.slice();
        const expensesById = merge({}, state.expensesById);

        // add the created expense
        addExpense(action.expense, unsortedIds, expensesById);

        // sort by descending date
        const expenseIds = sortBy(unsortedIds, id => expensesById[id].date)
          .reverse();

        // merge initial state to prevent mutations
        const create = initialState.create;

        return Object.assign({}, state, {
          create,
          isFetching: false,
          triggerId: null,
          modal: { isOpen: true, msg: action.msg },
          expenseIds,
          expensesById,
        });
      }

    case GET_EXPENSES_REQUEST_SUCC:
      {
        const expenseIds = [];
        const expensesById = {};

        action.expenses.forEach(el => addExpense(el, expenseIds, expensesById));

        return Object.assign({}, state, {
          isFetching: false,
          triggerId: null,
          expenseIds,
          expensesById,
        });
      }

    case DELETE_EXPENSE_REQUEST_SUCC:
      {
        // remove the deleted expense from cloned state objects
        const index = state.expenseIds.indexOf(state.expenseIdToDelete);

        const expenseIds = state.expenseIds.slice(0, index)
          .concat(state.expenseIds.slice(index + 1));

        const expensesById = merge({}, state.expensesById);

        delete expensesById[state.expenseIdToDelete];

        return Object.assign({}, state, {
          isFetching: false,
          triggerId: null,
          modal: { isOpen: true, msg: action.msg },
          expenseIds,
          expensesById,
          expenseIdToDelete: null,
        });
      }

    case EDIT_EXPENSE_REQUEST_SUCC:
      {
        // merge the edit object to store it on expensesById
        const expense = merge({}, state.edit);

        // cast amount to number so it doesn't cause issues when calculating weekly totals
        expense.amount = Number(expense.amount);

        // set the time on the MomentDate date property, and format to string like the expenses sent
        // by API
        const { time } = expense;

        expense.date
          .hours(time.hours())
          .minutes(time.minutes())
          .seconds(0);

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
          isFetching: false,
          triggerId: null,
          modal: { isOpen: true, msg: action.msg },
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

/**
 * Add an expense to the expenseIds array and the expensesById object
 *
 * @param {Expense} obj
 * @param {ObjectId[]} expenseIds
 * @param {ExpensesById} expensesById
 */
function addExpense(obj, expenseIds, expensesById) {
  const expense = merge({}, obj);
  const { id } = expense;

  delete expense.id;

  expenseIds.push(id);
  expensesById[id] = expense;
}

export { initialState };
export default expenses;
