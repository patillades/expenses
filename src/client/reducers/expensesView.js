import {
  TOGGLE_DAY_WEEK_EXPENSES
} from 'constants/actionTypes';

/**
 * @typedef {object} ExpensesViewState
 * @property {boolean} daily
 * @property {boolean} weekly
 */

/**
 * @type {ExpensesViewState}
 */
const initialState = {
  daily: true,
  weekly: false,
};

function expensesView(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DAY_WEEK_EXPENSES:
      return Object.assign({}, {
        daily: !state.daily,
        weekly: !state.weekly,
      });

    default:
      return state;
  }
}

export default expensesView;
