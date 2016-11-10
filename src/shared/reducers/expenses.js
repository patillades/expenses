import moment from 'moment';
import merge from 'lodash/merge';

import {
  CREATE_EXPENSE_DATE_CHANGE,
  CREATE_EXPENSE_TIME_CHANGE,
  INPUT_CHANGE,
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_REQUEST_ERR,
  CREATE_EXPENSE_REQUEST_SUCC,
  GET_EXPENSES_REQUEST_ERR,
  GET_EXPENSES_REQUEST_SUCC,
  CLOSE_MODAL
} from 'constants/actionTypes';

const initialState = {
  create: {
    date: moment(),
    time: moment().hours(0).minutes(0),
    description: '',
    amount: '',
    comment: '',
  },
  isFetching: false,
  modal: {
    isOpen: false,
    msg: null,
  },
  expenseIds: [],
  expensesById: {},
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

    case INPUT_CHANGE:
      return merge({}, state, {
        create: { [action.id]: action.value },
      });

    case CREATE_EXPENSE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case CREATE_EXPENSE_REQUEST_ERR:
    case GET_EXPENSES_REQUEST_ERR:
      return merge({}, state, {
        isFetching: false,
        modal: { isOpen: true, msg: action.msg },
      });

    case CREATE_EXPENSE_REQUEST_SUCC:
      return merge({}, {
        create: initialState.create,
        isFetching: false,
        modal: { isOpen: true, msg: action.msg },
      });

    case GET_EXPENSES_REQUEST_SUCC:
      const expenseIds = [];
      const expensesById = {};

      action.expenses.forEach(el => {
        const expense = Object.assign({}, el);
        const { id } = expense;

        delete expense.id;

        expenseIds.push(id);
        expensesById[id] = expense;
      });

      // @todo see what happens with the merge when the array is not empty
      return merge({}, state, { expenseIds, expensesById });

    default:
      return state;
  }
}

export default expenses;
