import React, { PropTypes } from 'react';
import moment from 'moment';

import { InlineButton } from './Button.jsx';

const propTypes = {
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  expenseIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  expensesById: PropTypes.objectOf(PropTypes.object).isRequired,
  deleteHandler: PropTypes.func.isRequired,
};

function ExpensesTable(props) {
  return (
    <table className="table table-responsive">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Comment</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {props.expenseIds.map(id => (
          <tr key={id}>
            <td>{formatDate(props.expensesById[id].date)}</td>
            <td>{props.expensesById[id].description}</td>
            <td>{props.expensesById[id].amount}</td>
            <td>{props.expensesById[id].comment}</td>
            <td>
              <InlineButton
                id={`delExpenseBtn_${id}`}
                triggerId={props.triggerId}
                className="btn-danger btn-xs"
                icon="remove"
                loaderSize={6}
                isLoading={props.isDisabled}
                clickHandler={props.deleteHandler}
                dataset={{ expense_id: id }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Format the expense's date
 *
 * @param {MomentDate} date
 * @return {string}
 */
function formatDate(date) {
  return moment(date).format('M/D/YYYY HH:mm');
}

ExpensesTable.propTypes = propTypes;

export default ExpensesTable;
