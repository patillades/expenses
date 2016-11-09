import React from 'react';

import Header from './Header.jsx';
import NewExpense from './NewExpense.jsx';

function UserExpenses(props) {
  return (
    <div>
      <Header />

      <NewExpense
        {...props.expenses.create}
        dateChangeHandler={props.dateChangeHandler}
      />
    </div>
  );
}

export default UserExpenses;
