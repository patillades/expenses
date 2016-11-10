import expect from 'expect';
import moment from 'moment';

import expenses, { initialState } from 'reducers/expenses';
import {
  inputChange,
  createExpenseDatetimeChange,
  initRequest
} from 'actions/actions';
import {
  CREATE_EXPENSE_DATE_CHANGE,
  CREATE_EXPENSE_TIME_CHANGE,
  CREATE_EXPENSE_REQUEST
} from 'constants/actionTypes';

describe('Expenses reducer', function () {
  it('should reflect changes on the expense create inputs', function () {
    const field = 'description';
    const value = 'foo';

    const newState = expenses(
      initialState,
      inputChange(field, value)
    );

    expect(newState.create[field]).toBe(value);
  });

  it('should reflect changes on the date/time inputs', function () {
    const date = moment().add({ days: 1, months: 1, years: 1 });

    let newState = expenses(
      initialState,
      createExpenseDatetimeChange(CREATE_EXPENSE_DATE_CHANGE, date)
    );

    expect(newState.create.date.format('M/D/YYYY')).toBe(date.format('M/D/YYYY'));

    const time = moment().add({ hours: 1, minutes: 1 });

    newState = expenses(
      initialState,
      createExpenseDatetimeChange(CREATE_EXPENSE_TIME_CHANGE, time)
    );

    expect(newState.create.time.format('HH:mm')).toBe(time.format('HH:mm'));
  });

  it('should reflect fetching on initRequest', function () {
    const newState = expenses(
      initialState,
      initRequest(CREATE_EXPENSE_REQUEST)
    );

    expect(newState.isFetching).toBe(true);
  });
});
