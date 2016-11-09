import React from 'react';

import Header from './Header.jsx';
import NewExpense from './NewExpense.jsx';
import Modal from './Modal.jsx';

function UserExpenses(props) {
  return (
    <div>
      <Header />

      <NewExpense
        {...props.expenses.create}
        isDisabled={props.expenses.isFetching}
        dateChangeHandler={props.dateChangeHandler}
        timeChangeHandler={props.timeChangeHandler}
        inputChangeHandler={props.inputChangeHandler}
        submitHandler={props.createExpenseSubmitHandler}
      />

      <Modal
        {...props.expenses.modal}
        clickHandler={props.modalBtnHandler}
      />
    </div>
  );
}

export default UserExpenses;
