import merge from 'lodash/merge';

import {
  FILTER_DATE_CHANGE,
  FILTER_INPUT_CHANGE,
  CLEAR_EXPENSES_FILTER,
} from 'constants/actionTypes';

const initialState = {
  $gte_date: null,
  $lte_date: null,
  $text: '',
  $gte_amount: '',
  $lte_amount: '',
};

function filters(state = initialState, action) {
  switch (action.type) {
    case FILTER_DATE_CHANGE:
      return merge({}, state, {
        [action.form]: action.date,
      });

    case FILTER_INPUT_CHANGE:
      const { field, value } = action;

      return merge({}, state, {
        [field]: value,
      });

    case CLEAR_EXPENSES_FILTER:
      return merge({}, state, initialState);

    default:
      return state;
  }
}

export default filters;
