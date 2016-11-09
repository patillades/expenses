import moment from 'moment';
import merge from 'lodash/merge';

import {
  CREATE_EXPENSE_DATE_CHANGE,
  CREATE_EXPENSE_TIME_CHANGE
} from 'constants/actionTypes';

const initialState = {
  create: {
    date: moment(),
    time: moment().hour(0).minute(0),
  },
};

function expenses(state = initialState, action) {
  switch (action.type) {
    case CREATE_EXPENSE_DATE_CHANGE:
      return merge({}, state, {
        create: { date: action.date },
      });

    case CREATE_EXPENSE_TIME_CHANGE:
      return merge({}, state, {
        create: { time: action.date },
      });

    default:
      return state;
  }
}

export default expenses;
