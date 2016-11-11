import React from 'react';

import Header from './Header.jsx';
import NewExpense from './NewExpense.jsx';
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
          dateChangeHandler={this.props.dateChangeHandler}
          timeChangeHandler={this.props.timeChangeHandler}
          inputChangeHandler={this.props.inputChangeHandler}
          submitHandler={this.props.createExpenseSubmitHandler}
        />

        <ExpensesTable
          expenseIds={this.props.expenses.expenseIds}
          expensesById={this.props.expenses.expensesById}
          triggerId={this.props.expenses.triggerId}
          expenseIdOnEdition={this.props.expenses.expenseIdOnEdition}
          isDisabled={this.props.expenses.isFetching}
          deleteHandler={this.props.deleteExpenseHandler}
          editHandler={this.props.editExpenseHandler}
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
