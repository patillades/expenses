import React, { PropTypes } from 'react';

import ExpenseInputs from './ExpenseInputs.jsx';
import { InlineButton } from './Button.jsx';

const propTypes = {
  date: PropTypes.object.isRequired,
  time: PropTypes.object,
  description: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  timeChangeHandler: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
};

function NewExpense(props) {
  return (
    <form>
      <fieldset disabled={props.isDisabled}>
        <table className="table">
          <tbody>
            <ExpenseInputs
              form="create"
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

NewExpense.propTypes = propTypes;

export default NewExpense;
