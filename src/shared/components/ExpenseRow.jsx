import React, { PropTypes } from 'react';
import moment from 'moment';

import { InlineButton } from './Button.jsx';
import ExpenseInputs from './ExpenseInputs.jsx';

const propTypes = {
  id: PropTypes.string.isRequired,
  expense: PropTypes.shape({
    date: PropTypes.object,
    amount: PropTypes.number,
    description: PropTypes.string,
    comment: PropTypes.string,
  }).isRequired,
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  isOnEdition: PropTypes.bool.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  editHandler: PropTypes.func.isRequired,
};

function ExpenseRow(props) {
  if (props.isOnEdition) {
    return (
      <ExpenseInputs
        description={props.expense.description}
        amount={props.expense.amount}
        comment={props.expense.comment}
      />
    );
  }

  const { date, time } = formatDate(props.expense.date);

  return (
    <tr>
      <td>{date}</td>
      <td>{time}</td>
      <td>{props.expense.description}</td>
      <td>{props.expense.amount}</td>
      <td>{props.expense.comment}</td>
      <td>
        <InlineButton
          id={`editExpenseBtn_${props.id}`}
          triggerId={`edit_${props.triggerId}`}
          className="btn-info btn-xs"
          icon="edit"
          loaderSize={6}
          isLoading={props.isDisabled}
          clickHandler={props.editHandler}
          dataset={{ expense_id: props.id }}
        />

        <InlineButton
          id={`delExpenseBtn_${props.id}`}
          triggerId={`del_${props.triggerId}`}
          className="btn-danger btn-xs"
          icon="remove"
          loaderSize={6}
          isLoading={props.isDisabled}
          clickHandler={props.deleteHandler}
          dataset={{ expense_id: props.id }}
        />
      </td>
    </tr>
  );
}

/**
 * Format the expense's date
 *
 * @param {MomentDate} date
 * @return {{date: string, time: string}}
 */
function formatDate(date) {
  const dateObj = moment(date);

  return {
    date: dateObj.format('M/D/YYYY'),
    time: dateObj.format('HH:mm'),
  };
}

export default ExpenseRow;