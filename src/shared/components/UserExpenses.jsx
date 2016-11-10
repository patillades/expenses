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
          isDisabled={this.props.expenses.isFetching}
          dateChangeHandler={this.props.dateChangeHandler}
          timeChangeHandler={this.props.timeChangeHandler}
          inputChangeHandler={this.props.inputChangeHandler}
          submitHandler={this.props.createExpenseSubmitHandler}
        />

        <ExpensesTable />

        <Modal
          {...this.props.expenses.modal}
          clickHandler={this.props.modalBtnHandler}
        />
      </div>
    );
  }
}

export default UserExpenses;
