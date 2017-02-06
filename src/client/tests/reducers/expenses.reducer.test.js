import expect from 'expect';
import moment from 'moment';

import expenses, { initialState } from 'reducers/expenses';
import {
  inputChange,
  expenseDatetimeChange,
} from 'actions/actions';
import {
  EXPENSES_INPUT_CHANGE,
  EXPENSE_DATE_CHANGE,
  EXPENSE_TIME_CHANGE,
} from 'constants/actionTypes';

describe('Expenses reducer', () => {
  it('should reflect changes on the expense create inputs', () => {
    const field = 'description';
    const value = 'foo';

    const newState = expenses(
      initialState,
      inputChange(EXPENSES_INPUT_CHANGE, 'create', field, value)
    );

    expect(newState.create[field]).toBe(value);
  });

  it('should reflect changes on the create date/time inputs', () => {
    const date = moment().add({ days: 1, months: 1, years: 1 });

    let newState = expenses(
      initialState,
      expenseDatetimeChange(EXPENSE_DATE_CHANGE, 'create', date)
    );

    expect(newState.create.date.format('M/D/YYYY')).toBe(date.format('M/D/YYYY'));

    const time = moment().add({ hours: 1, minutes: 1 });

    newState = expenses(
      initialState,
      expenseDatetimeChange(EXPENSE_TIME_CHANGE, 'create', time)
    );

    expect(newState.create.time.format('HH:mm')).toBe(time.format('HH:mm'));
  });
});
