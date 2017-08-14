import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { InlineButton } from './Button.jsx';
import ExpenseInputs from './ExpenseInputs.jsx';

const propTypes = {
  id: PropTypes.string.isRequired,
  editObj: PropTypes.shape({
    date: PropTypes.object.isRequired,
    time: PropTypes.object,
    description: PropTypes.string.isRequired,
    amount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    comment: PropTypes.string,
    expenseCategoryId: PropTypes.string,
  }).isRequired,
  expense: PropTypes.shape({
    expenseCategoryId: PropTypes.string,
    date: PropTypes.string,
    amount: PropTypes.number,
    description: PropTypes.string,
    comment: PropTypes.string,
  }).isRequired,
  expenseCategories: PropTypes.object.isRequired,
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  isOnEdition: PropTypes.bool.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  editHandler: PropTypes.func.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  editSubmitHandler: PropTypes.func.isRequired,
  cancelEditHandler: PropTypes.func.isRequired,
  expenseCategoryChangeHandler: PropTypes.func.isRequired,
};

function ExpenseRow(props) {
  if (props.isOnEdition) {
    return (
      <ExpenseInputs
        form="edit"
        {...props.editObj}
        expenseCategories={props.expenseCategories}
        isOnEdition={props.isOnEdition}
        isDisabled={props.isDisabled}
        dateChangeHandler={props.dateChangeHandler}
        inputChangeHandler={props.inputChangeHandler}
        expenseCategoryChangeHandler={props.expenseCategoryChangeHandler}
      >
        <td>
          <InlineButton
            id="editExpenseBtn"
            triggerId={props.triggerId}
            className="btn-success btn-xs"
            title="save changes"
            icon="save"
            loaderSize={6}
            isLoading={props.isDisabled}
            clickHandler={props.editSubmitHandler}
          />

          <InlineButton
            id="cancelEditExpenseBtn"
            triggerId={props.triggerId}
            className="btn-default btn-xs"
            title="cancel changes"
            icon="remove"
            isLoading={props.isDisabled}
            clickHandler={props.cancelEditHandler}
          />
        </td>
      </ExpenseInputs>
    );
  }

  return (
    <tr>
      <td>{moment(props.expense.date).format('M/D/YYYY')}</td>
      <td>{props.expense.description}</td>
      <td>{props.expense.amount}</td>
      <td>
        {
          props.expenseCategories.byId[props.expense.expenseCategoryId]
            ? props.expenseCategories.byId[props.expense.expenseCategoryId].title
            : ''
        }
      </td>
      <td>{props.expense.comment}</td>
      <td>
        <InlineButton
          id={`editExpenseBtn_${props.id}`}
          triggerId={`edit_${props.triggerId}`}
          className="btn-info btn-xs"
          title="edit expense"
          icon="edit"
          loaderSize={6}
          isLoading={props.isDisabled}
          clickHandler={props.editHandler}
          dataset={{ expense_id: props.id }}
          type="button"
        />

        <InlineButton
          id={`delExpenseBtn_${props.id}`}
          triggerId={`del_${props.triggerId}`}
          className="btn-danger btn-xs"
          title="delete expense"
          icon="remove"
          loaderSize={6}
          isLoading={props.isDisabled}
          clickHandler={props.deleteHandler}
          dataset={{ expense_id: props.id }}
          type="button"
        />
      </td>
    </tr>
  );
}

ExpenseRow.propTypes = propTypes;

export default ExpenseRow;
