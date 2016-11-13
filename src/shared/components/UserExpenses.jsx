import React from 'react';

import Header from './Header.jsx';
import NewExpense from './NewExpense.jsx';
import Filters from './Filters.jsx';
import ExpensesTable from './ExpensesTable.jsx';
import Modal from './Modal.jsx';

class UserExpenses extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.loadUserExpenses();
  }

  render() {
    return (
      <div>
        <Header />

        <NewExpense
          {...this.props.expenses.create}
          triggerId={this.props.expenses.triggerId}
          isDisabled={this.props.expenses.isFetching}
          dateChangeHandler={this.props.dateChangeHandler.bind(null, 'create')}
          timeChangeHandler={this.props.timeChangeHandler.bind(null, 'create')}
          inputChangeHandler={this.props.inputChangeHandler}
          submitHandler={this.props.createExpenseSubmitHandler}
        />

        <div className="panel panel-info">
          <div className="panel-heading">Filter the expenses</div>

          <Filters
            form="filters"
            {...this.props.expenses.filters}
            triggerId={this.props.expenses.triggerId}
            isDisabled={this.props.expenses.isFetching}
            dateChangeHandler={this.props.filterDateChangeHandler}
            inputChangeHandler={this.props.inputChangeHandler}
            submitHandler={this.props.loadUserExpenses}
            clearHandler={this.props.clearExpensesFilterHandler}
          />
        </div>

        <ExpensesTable
          editObj={this.props.expenses.edit}
          expenseIds={this.props.expenses.expenseIds}
          expensesById={this.props.expenses.expensesById}
          triggerId={this.props.expenses.triggerId}
          expenseIdOnEdition={this.props.expenses.expenseIdOnEdition}
          isDisabled={this.props.expenses.isFetching}
          deleteHandler={this.props.deleteExpenseHandler}
          editHandler={this.props.editExpenseHandler}
          dateChangeHandler={this.props.dateChangeHandler.bind(null, 'edit')}
          timeChangeHandler={this.props.timeChangeHandler.bind(null, 'edit')}
          inputChangeHandler={this.props.inputChangeHandler}
          editSubmitHandler={this.props.editExpenseSubmitHandler}
          cancelEditHandler={this.props.cancelEditExpenseHandler}
        />

        <Modal
          {...this.props.expenses.modal}
          clickHandler={this.props.modalBtnHandler}
        />
      </div>
    );
  }
}

export default UserExpenses;
