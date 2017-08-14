import React from 'react';
import PropTypes from 'prop-types';

import ExpenseInputs from './ExpenseInputs.jsx';
import { InlineButton } from './Button.jsx';

const propTypes = {
  date: PropTypes.object.isRequired,
  time: PropTypes.object,
  description: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  expenseCategoryId: PropTypes.string,
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  newCategoryBtnHandler: PropTypes.func.isRequired,
  expenseCategories: PropTypes.object.isRequired,
  expenseCategoryChangeHandler: PropTypes.func.isRequired,
};

function NewExpense(props) {
  return (
    <form>
      <fieldset disabled={props.isDisabled}>
        <ExpenseInputs
          form="create"
          triggerId={props.triggerId}
          date={props.date}
          time={props.time}
          description={props.description}
          amount={props.amount}
          comment={props.comment}
          expenseCategoryId={props.expenseCategoryId}
          isDisabled={props.isDisabled}
          inputChangeHandler={props.inputChangeHandler}
          dateChangeHandler={props.dateChangeHandler}
          hasNewCategoryBtn
          newCategoryBtnHandler={props.newCategoryBtnHandler}
          expenseCategories={props.expenseCategories}
          expenseCategoryChangeHandler={props.expenseCategoryChangeHandler}
        >
          <InlineButton
            id="addExpenseBtn"
            triggerId={props.triggerId}
            txt="Add expense"
            isLoading={props.isDisabled}
            clickHandler={props.submitHandler}
          />
        </ExpenseInputs>
      </fieldset>
    </form>
  );
}

NewExpense.propTypes = propTypes;

export default NewExpense;
