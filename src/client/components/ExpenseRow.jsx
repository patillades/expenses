import React, { PropTypes } from 'react';
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
    comment: PropTypes.string.isRequired,
  }).isRequired,
  expense: PropTypes.shape({
    date: PropTypes.string,
    amount: PropTypes.number,
    description: PropTypes.string,
    comment: PropTypes.string,
  }).isRequired,
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  isOnEdition: PropTypes.bool.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  editHandler: PropTypes.func.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  timeChangeHandler: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  editSubmitHandler: PropTypes.func.isRequired,
  cancelEditHandler: PropTypes.func.isRequired,
};

function ExpenseRow(props) {
  if (props.isOnEdition) {
    return (
      <ExpenseInputs
        form="edit"
        {...props.editObj}
        dateChangeHandler={props.dateChangeHandler}
        timeChangeHandler={props.timeChangeHandler}
        inputChangeHandler={props.inputChangeHandler}
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
      <td>&nbsp;</td>
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
