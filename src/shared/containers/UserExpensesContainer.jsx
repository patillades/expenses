import connect from 'react-redux/lib/components/connect';

import UserExpenses from 'components/UserExpenses.jsx';
import {
  expenseDatetimeChange,
  inputChange,
  initRequest,
  sendRequest,
  modalBtnClick,
  editExpense,
  cancelEditExpense
} from 'actions/actions';
import {
  EXPENSES_INPUT_CHANGE,
  EXPENSE_DATE_CHANGE,
  EXPENSE_TIME_CHANGE,
  FILTER_DATE_CHANGE,
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
    dateChangeHandler: (form, date) => dispatch(expenseDatetimeChange(
      EXPENSE_DATE_CHANGE,
      form,
      date
    )),

    timeChangeHandler: (form, date) => dispatch(expenseDatetimeChange(
      EXPENSE_TIME_CHANGE,
      form,
      date
    )),

    filterDateChangeHandler: (field, date) => dispatch(expenseDatetimeChange(
      FILTER_DATE_CHANGE,
      field,
      date
    )),

    inputChangeHandler: e => dispatch(inputChange(
      EXPENSES_INPUT_CHANGE,
      e.target.dataset.form,
      e.target.dataset.field,
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

    // on app start, it's called on componentWillMount@UserExpenses, so there's no e argument
    loadUserExpenses: e => dispatch(sendRequest(
      GET_EXPENSES_REQUEST,
      { triggerId: e ? e.target.id : null }
    )),

    deleteExpenseHandler: e => dispatch(sendRequest(
      DELETE_EXPENSE_REQUEST,
      {
        triggerId: e.target.id,
        expenseId: e.target.dataset.expense_id,
      }
    )),

    editExpenseHandler: e => dispatch(editExpense(e.target.dataset.expense_id)),

    cancelEditExpenseHandler: () => dispatch(cancelEditExpense()),
  };
}

const UserExpensesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserExpenses);

export default UserExpensesContainer;
