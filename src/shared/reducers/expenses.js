import moment from 'moment';
import merge from 'lodash/merge';

import {
  CALENDAR_DATE_CHANGE
} from 'constants/actionTypes';

const initialState = {
  create: {
    date: moment(),
  },

};

function expenses(state = initialState, action) {
  switch (action.type) {
    case CALENDAR_DATE_CHANGE:
      return merge({}, state, {
        create: { date: action.date },
      });

    default:
      return state;
  }
}

export default expenses;
