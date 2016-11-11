import React from 'react';

import ExpenseInputs from './ExpenseInputs.jsx';
import { InlineButton } from './Button.jsx';

function NewExpense(props) {
  return (
    <form className="form-inline">
      <fieldset disabled={props.isDisabled}>
        <ExpenseInputs
          date={props.date}
          time={props.time}
          description={props.description}
          amount={props.amount}
          comment={props.comment}
          inputChangeHandler={props.inputChangeHandler}
          dateChangeHandler={props.dateChangeHandler}
          timeChangeHandler={props.timeChangeHandler}
        />

        <InlineButton
          id="addExpenseBtn"
          triggerId={props.triggerId}
          txt="Add expense"
          isLoading={props.isDisabled}
          clickHandler={props.submitHandler}
        />
      </fieldset>
    </form>
  );
}

export default NewExpense;
