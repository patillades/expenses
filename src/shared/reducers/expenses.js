import moment from 'moment';
import merge from 'lodash/merge';
import sortBy from 'lodash/sortBy';

import {
  CREATE_EXPENSE_DATE_CHANGE,
  CREATE_EXPENSE_TIME_CHANGE,
  INPUT_CHANGE,
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_REQUEST_ERR,
  CREATE_EXPENSE_REQUEST_SUCC,
  GET_EXPENSES_REQUEST_ERR,
  GET_EXPENSES_REQUEST_SUCC,
  CLOSE_MODAL,
  DELETE_EXPENSE_REQUEST,
  DELETE_EXPENSE_REQUEST_ERR,
  DELETE_EXPENSE_REQUEST_SUCC,
  EDIT_EXPENSE
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
 * @property {Date|MomentDate|string} date
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
 * @property {ObjectId} expenseIds
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
      return merge({}, state, {
        modal: { isOpen: false, msg: null },
      });

    case CREATE_EXPENSE_DATE_CHANGE:
      return merge({}, state, {
        create: { date: action.date },
      });

    case CREATE_EXPENSE_TIME_CHANGE:
      return merge({}, state, {
        create: { time: action.date },
      });

    // the id field on the create/edit forms has the format "formName_fieldName"
    case INPUT_CHANGE:
      const [form, field] = action.id.split('_');

      return merge({}, state, {
        [form]: { [field]: action.value },
      });

    case EDIT_EXPENSE:
      const expense = state.expensesById[action.expenseId];
      const date = moment(expense.date);
      const time = moment(expense.date);
      const { description, amount, comment } = expense;

      return merge({}, state, {
        expenseIdOnEdition: action.expenseId,
        edit: { date, time, description, amount, comment },
      });

    case CREATE_EXPENSE_REQUEST:
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
      return merge({}, state, {
        isFetching: false,
        triggerId: null,
        modal: { isOpen: true, msg: action.msg },
      });

    case DELETE_EXPENSE_REQUEST_ERR:
      return merge({}, state, {
        isFetching: false,
        triggerId: null,
        modal: { isOpen: true, msg: action.msg },
        expenseIdToDelete: null,
      });

    case CREATE_EXPENSE_REQUEST_SUCC:
      {
        const unsortedIds = state.expenseIds.slice();
        const expensesById = Object.assign({}, state.expensesById);

        addExpense(action.expense, unsortedIds, expensesById);

        // sort by descending date
        const expenseIds = sortBy(unsortedIds, id => expensesById[id].date)
          .reverse();

        return merge({}, state, {
          create: initialState.create,
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

        // @todo see what happens with the merge when the array is not empty
        // expensesById merges right, but the expenseIds replaces the values on the given positions
        return merge({}, state, { expenseIds, expensesById });
      }

    case DELETE_EXPENSE_REQUEST_SUCC:
      {
        const index = state.expenseIds.indexOf(state.expenseIdToDelete);

        const expenseIds = state.expenseIds.slice(0, index)
          .concat(state.expenseIds.slice(index + 1));

        const expensesById = Object.assign({}, state.expensesById);

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
  const expense = Object.assign({}, obj);
  const { id } = expense;

  delete expense.id;

  expenseIds.push(id);
  expensesById[id] = expense;
}

export { initialState };
export default expenses;
