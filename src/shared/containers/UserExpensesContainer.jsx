import connect from 'react-redux/lib/components/connect';

import UserExpenses from 'components/UserExpenses.jsx';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

const UserExpensesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserExpenses);

export default UserExpensesContainer;
