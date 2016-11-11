import React from 'react';

import ExpenseInputs from './ExpenseInputs.jsx';
import { InlineButton } from './Button.jsx';

function NewExpense(props) {
  return (
    <form>
      <fieldset disabled={props.isDisabled}>
        <table className="table">
          <tbody>
            <ExpenseInputs
              formPrefix="create"
              date={props.date}
              time={props.time}
              description={props.description}
              amount={props.amount}
              comment={props.comment}
              inputChangeHandler={props.inputChangeHandler}
              dateChangeHandler={props.dateChangeHandler}
              timeChangeHandler={props.timeChangeHandler}
            >
              <td>
                <InlineButton
                  id="addExpenseBtn"
                  triggerId={props.triggerId}
                  txt="Add expense"
                  isLoading={props.isDisabled}
                  clickHandler={props.submitHandler}
                />
              </td>
            </ExpenseInputs>
          </tbody>
        </table>
      </fieldset>
    </form>
  );
}

export default NewExpense;
