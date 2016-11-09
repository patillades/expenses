import connect from 'react-redux/lib/components/connect';

import UserExpenses from 'components/UserExpenses.jsx';
import { createExpenseDatetimeChange } from 'actions/actions';
import {
  CREATE_EXPENSE_DATE_CHANGE,
  CREATE_EXPENSE_TIME_CHANGE
} from 'constants/actionTypes';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    dateChangeHandler: date => dispatch(createExpenseDatetimeChange(
      CREATE_EXPENSE_DATE_CHANGE,
      date
    )),

    timeChangeHandler: date => dispatch(createExpenseDatetimeChange(
      CREATE_EXPENSE_TIME_CHANGE,
      date
    )),
  };
}

const UserExpensesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserExpenses);

export default UserExpensesContainer;
