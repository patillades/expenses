import connect from 'react-redux/lib/components/connect';

import UserExpenses from 'components/UserExpenses.jsx';
import { calendarDateChange } from 'actions/actions';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    dateChangeHandler: date => dispatch(calendarDateChange(date)),
  };
}

const UserExpensesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserExpenses);

export default UserExpensesContainer;
