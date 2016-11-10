import connect from 'react-redux/lib/components/connect';

import UserExpenses from 'components/UserExpenses.jsx';
import {
  createExpenseDatetimeChange,
  inputChange,
  initRequest,
  sendRequest,
  modalBtnClick
} from 'actions/actions';
import {
  CREATE_EXPENSE,
  CREATE_EXPENSE_DATE_CHANGE,
  CREATE_EXPENSE_TIME_CHANGE,
  CREATE_EXPENSE_REQUEST,
  GET_EXPENSES,
  DELETE_EXPENSE,
  DELETE_EXPENSE_REQUEST
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

    inputChangeHandler: e => dispatch(inputChange(
      e.target.id,
      e.target.value
    )),

    createExpenseSubmitHandler: () => {
      dispatch(initRequest(CREATE_EXPENSE_REQUEST));
      dispatch(sendRequest(CREATE_EXPENSE));
    },

    modalBtnHandler: () => dispatch(modalBtnClick()),

    loadUserExpenses: () => dispatch(sendRequest(GET_EXPENSES)),

    deleteExpenseHandler: e => {
      dispatch(initRequest(
        DELETE_EXPENSE_REQUEST,
        { expenseId: e.target.dataset.expense_id }
      ));
      dispatch(sendRequest(DELETE_EXPENSE));
    },
  };
}

const UserExpensesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserExpenses);

export default UserExpensesContainer;
