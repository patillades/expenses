import connect from 'react-redux/lib/components/connect';

import UserExpenses from 'components/UserExpenses.jsx';
import {
  expenseDateChange,
  inputChange,
  sendRequest,
  modalBtnClick,
  editExpense,
  action,
  logOut,
} from 'actions/actions';
import {
  EXPENSES_INPUT_CHANGE,
  EXPENSE_DATE_CHANGE,
  FILTER_DATE_CHANGE,
  FILTER_INPUT_CHANGE,
  CLEAR_EXPENSES_FILTER,
  TOGGLE_DAY_WEEK_EXPENSES,
  CLOSE_MODAL,
  CREATE_EXPENSE_REQUEST,
  GET_EXPENSES_REQUEST,
  GET_EXPENSES_REQUEST_ON_LOAD,
  DELETE_EXPENSE_REQUEST,
  CANCEL_EDIT_EXPENSE,
  EDIT_EXPENSE_REQUEST,
  OPEN_INPUT_MODAL,
  MODAL_INPUT_CHANGE,
  CREATE_EXPENSE_CATEGORY_REQUEST,
  GET_EXPENSE_CATEGORIES_REQUEST,
  CHANGE_CATEGORY_EXPENSE,
} from 'constants/actionTypes';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  // on app start, it's called on componentWillMount@UserExpenses, so there's no e argument and
  // we'll use a constant instead so we know that the loader has to be shown
  function loadUserExpenses(e) {
    if (e) {
      // prevent default so the form submission doesn't force a page reload
      e.preventDefault();
    }

    return dispatch(sendRequest(
      GET_EXPENSES_REQUEST,
      { triggerId: e ? e.target.id : GET_EXPENSES_REQUEST_ON_LOAD }
    ));
  }

  function dispatchInputChange(e, type) {
    return dispatch(inputChange(
      type,
      e.target.dataset.form,
      e.target.dataset.field,
      e.target.value
    ));
  }

  return {
    dateChangeHandler: (form, date) => dispatch(expenseDateChange(
      EXPENSE_DATE_CHANGE,
      form,
      date
    )),

    filterDateChangeHandler: (field, date) => dispatch(expenseDateChange(
      FILTER_DATE_CHANGE,
      field,
      date
    )),

    inputChangeHandler: e => dispatchInputChange(e, EXPENSES_INPUT_CHANGE),

    filterInputChangeHandler: e => dispatchInputChange(e, FILTER_INPUT_CHANGE),

    createExpenseSubmitHandler: (e) => {
      // prevent default so the form submission doesn't force a page reload
      e.preventDefault();

      dispatch(sendRequest(
        CREATE_EXPENSE_REQUEST,
        { triggerId: e.target.id }
      ));
    },

    editExpenseSubmitHandler: (e) => {
      // prevent default so the form submission doesn't force a page reload
      e.preventDefault();

      dispatch(sendRequest(
        EDIT_EXPENSE_REQUEST,
        { triggerId: e.target.id }
      ));
    },

    modalBtnHandler: () => dispatch(modalBtnClick()),

    loadUserExpenses,

    deleteExpenseHandler: e => dispatch(sendRequest(
      DELETE_EXPENSE_REQUEST,
      {
        triggerId: e.target.id,
        expenseId: e.target.dataset.expense_id,
      }
    )),

    editExpenseHandler: e => dispatch(editExpense(e.target.dataset.expense_id)),

    cancelEditExpenseHandler: () => dispatch(action(CANCEL_EDIT_EXPENSE)),

    clearExpensesFilterHandler: (e) => {
      dispatch(action(CLEAR_EXPENSES_FILTER));

      loadUserExpenses(e);
    },

    toggleDayWeekExpensesHandler: () => dispatch(action(TOGGLE_DAY_WEEK_EXPENSES)),

    logOutHandler: () => dispatch(logOut()),

    newCategoryBtnHandler: (e) => {
      // prevent default so the form submission doesn't force a page reload
      e.preventDefault();

      dispatch(action(OPEN_INPUT_MODAL));
    },

    modalInputChangeHandler: e => dispatchInputChange(e, MODAL_INPUT_CHANGE),

    newCategoryModalEventHandler: (e) => {
      // close on ESC or click on overlay
      if (e.keyCode === 27 || e.target.className.includes('ReactModal__Overlay')) {
        return dispatch(action(CLOSE_MODAL));
      }

      return dispatch(sendRequest(
        CREATE_EXPENSE_CATEGORY_REQUEST,
        { triggerId: e.target.id }
      ))
    },

    loadUserExpenseCategories: () => dispatch(sendRequest(GET_EXPENSE_CATEGORIES_REQUEST)),

    expenseCategoryChangeHandler: e => dispatchInputChange(e, CHANGE_CATEGORY_EXPENSE),
  };
}

const UserExpensesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserExpenses);

export default UserExpensesContainer;
