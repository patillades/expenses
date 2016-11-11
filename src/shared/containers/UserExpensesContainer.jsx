import connect from 'react-redux/lib/components/connect';

import UserExpenses from 'components/UserExpenses.jsx';
import {
  createExpenseDatetimeChange,
  inputChange,
  initRequest,
  sendRequest,
  modalBtnClick,
  editExpense
} from 'actions/actions';
import {
  CREATE_EXPENSE_DATE_CHANGE,
  CREATE_EXPENSE_TIME_CHANGE,
  CREATE_EXPENSE_REQUEST,
  GET_EXPENSES_REQUEST,
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

    createExpenseSubmitHandler: e => dispatch(sendRequest(
      CREATE_EXPENSE_REQUEST,
      { triggerId: e.target.id }
    )),

    modalBtnHandler: () => dispatch(modalBtnClick()),

    loadUserExpenses: () => dispatch(sendRequest(GET_EXPENSES_REQUEST)),

    deleteExpenseHandler: e => dispatch(sendRequest(
      DELETE_EXPENSE_REQUEST,
      {
        triggerId: e.target.id,
        expenseId: e.target.dataset.expense_id,
      }
    )),

    editExpenseHandler: e => dispatch(editExpense(e.target.dataset.expense_id)),
  };
}

const UserExpensesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserExpenses);

export default UserExpensesContainer;
