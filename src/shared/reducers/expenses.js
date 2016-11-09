import moment from 'moment';
import merge from 'lodash/merge';

import {
  CREATE_EXPENSE_DATE_CHANGE,
  CREATE_EXPENSE_TIME_CHANGE,
  INPUT_CHANGE,
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_REQUEST_ERR,
  CREATE_EXPENSE_REQUEST_SUCC,
  CLOSE_MODAL
} from 'constants/actionTypes';

const initialState = {
  create: {
    date: moment(),
    time: moment().hour(0).minute(0),
    description: '',
    amount: '',
    comment: '',
  },
  isFetching: false,
  modal: {
    isOpen: false,
    msg: null,
  },
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

    default:
      return state;
  }
}

export default expenses;
