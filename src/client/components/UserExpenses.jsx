import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header.jsx';
import NewExpense from './NewExpense.jsx';
import Filters from './Filters.jsx';
import ToggleDayWeekExpenses from './ToggleDayWeekExpenses.jsx';
import ExpensesPerWeek from './ExpensesPerWeek.jsx';
import ExpensesTable from './ExpensesTable.jsx';
import Modal from './Modal.jsx';
import InputModal from './InputModal.jsx';

const propTypes = {
  authenticated: PropTypes.shape({
    token: PropTypes.string,
    registration: PropTypes.shape({
      name: PropTypes.string.isRequired,
      mail: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    }).isRequired,
    login: PropTypes.shape({
      mail: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  requests: PropTypes.shape({
    triggerId: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
  }).isRequired,
  expenses: PropTypes.shape({
    create: PropTypes.shape({
      date: PropTypes.object.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      comment: PropTypes.string,
      expenseCategoryId: PropTypes.string,
    }).isRequired,
    edit: PropTypes.shape({
      date: PropTypes.object.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      comment: PropTypes.string,
      expenseCategoryId: PropTypes.string,
    }).isRequired,
    ids: PropTypes.arrayOf(PropTypes.string).isRequired,
    byId: PropTypes.objectOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      comment: PropTypes.string,
    })).isRequired,
    expenseIdOnEdition: PropTypes.string,
    expenseIdToDelete: PropTypes.string,
  }).isRequired,
  filters: PropTypes.shape({
    $gte_date: PropTypes.object,
    $lte_date: PropTypes.object,
    $text: PropTypes.string.isRequired,
    $gte_amount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    $lte_amount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  }).isRequired,
  expensesView: PropTypes.shape({
    daily: PropTypes.bool.isRequired,
    weekly: PropTypes.bool.isRequired,
  }).isRequired,
  modals: PropTypes.shape({
    inputModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      msg: PropTypes.string.isRequired,
    }).isRequired,
    msgModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      txt: PropTypes.string,
    }).isRequired,
  }).isRequired,
  expenseCategories: PropTypes.shape({
    ids: PropTypes.arrayOf(PropTypes.string).isRequired,
    byId: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  loadUserExpenses: PropTypes.func.isRequired,
  loadUserExpenseCategories: PropTypes.func.isRequired,
  logOutHandler: PropTypes.func.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  createExpenseSubmitHandler: PropTypes.func.isRequired,
  filterDateChangeHandler: PropTypes.func.isRequired,
  filterInputChangeHandler: PropTypes.func.isRequired,
  clearExpensesFilterHandler: PropTypes.func.isRequired,
  toggleDayWeekExpensesHandler: PropTypes.func.isRequired,
  deleteExpenseHandler: PropTypes.func.isRequired,
  editExpenseHandler: PropTypes.func.isRequired,
  editExpenseSubmitHandler: PropTypes.func.isRequired,
  cancelEditExpenseHandler: PropTypes.func.isRequired,
  modalBtnHandler: PropTypes.func.isRequired,
  newCategoryBtnHandler: PropTypes.func.isRequired,
  modalInputChangeHandler: PropTypes.func.isRequired,
  newCategoryModalEventHandler: PropTypes.func.isRequired,
  expenseCategoryChangeHandler: PropTypes.func.isRequired,
};

class UserExpenses extends React.Component {
  // if user is authenticated (state or preloaded via localStorage), get expenses and categories
  componentWillMount() {
    if (this.props.authenticated.token) {
      this.props.loadUserExpenses();
      this.props.loadUserExpenseCategories();
    }
  }

  render() {
    return (
      <div>
        <Header
          hasLogOutBtn
          triggerId={this.props.requests.triggerId}
          isDisabled={this.props.requests.isFetching}
          clickHandler={this.props.logOutHandler}
        />

        <NewExpense
          {...this.props.expenses.create}
          triggerId={this.props.requests.triggerId}
          isDisabled={this.props.requests.isFetching}
          dateChangeHandler={date => this.props.dateChangeHandler('create', date)}
          inputChangeHandler={this.props.inputChangeHandler}
          submitHandler={this.props.createExpenseSubmitHandler}
          newCategoryBtnHandler={this.props.newCategoryBtnHandler}
          expenseCategories={this.props.expenseCategories}
          expenseCategoryChangeHandler={this.props.expenseCategoryChangeHandler}
        />

        <Filters
          form="filters"
          {...this.props.filters}
          triggerId={this.props.requests.triggerId}
          isDisabled={this.props.requests.isFetching}
          dateChangeHandler={this.props.filterDateChangeHandler}
          inputChangeHandler={this.props.filterInputChangeHandler}
          submitHandler={this.props.loadUserExpenses}
          clearHandler={this.props.clearExpensesFilterHandler}
        />

        <ToggleDayWeekExpenses
          view={this.props.expensesView}
          triggerId={this.props.requests.triggerId}
          isDisabled={this.props.requests.isFetching}
          clickHandler={this.props.toggleDayWeekExpensesHandler}
        />

        <ExpensesTable
          isVisible={this.props.expensesView.daily}
          editObj={this.props.expenses.edit}
          expenseIds={this.props.expenses.ids}
          expensesById={this.props.expenses.byId}
          expenseCategories={this.props.expenseCategories}
          triggerId={this.props.requests.triggerId}
          expenseIdOnEdition={this.props.expenses.expenseIdOnEdition}
          isDisabled={this.props.requests.isFetching}
          deleteHandler={this.props.deleteExpenseHandler}
          editHandler={this.props.editExpenseHandler}
          dateChangeHandler={date => this.props.dateChangeHandler('edit', date)}
          inputChangeHandler={this.props.inputChangeHandler}
          editSubmitHandler={this.props.editExpenseSubmitHandler}
          cancelEditHandler={this.props.cancelEditExpenseHandler}
          expenseCategoryChangeHandler={this.props.expenseCategoryChangeHandler}
        />

        <ExpensesPerWeek
          isVisible={this.props.expensesView.weekly}
          expenseIds={this.props.expenses.ids}
          expensesById={this.props.expenses.byId}
        />

        <Modal
          {...this.props.modals.msgModal}
          clickHandler={this.props.modalBtnHandler}
        />

        <InputModal
          {...this.props.modals.inputModal}
          clickHandler={this.props.newCategoryModalEventHandler}
          inputChangeHandler={this.props.modalInputChangeHandler}
        />
      </div>
    );
  }
}

UserExpenses.propTypes = propTypes;

export default UserExpenses;
