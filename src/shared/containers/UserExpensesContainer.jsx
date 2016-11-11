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
  EXPENSE_DATE_CHANGE,
  EXPENSE_TIME_CHANGE,
  CREATE_EXPENSE_REQUEST,
  GET_EXPENSES_REQUEST,
  DELETE_EXPENSE_REQUEST,
  EDIT_EXPENSE_REQUEST
} from 'constants/actionTypes';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    dateChangeHandler: (form, date) => dispatch(createExpenseDatetimeChange(
      EXPENSE_DATE_CHANGE,
      form,
      date
    )),

    timeChangeHandler: (form, date) => dispatch(createExpenseDatetimeChange(
      EXPENSE_TIME_CHANGE,
      form,
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

    editExpenseSubmitHandler: e => dispatch(sendRequest(
      EDIT_EXPENSE_REQUEST,
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
