import React, { PropTypes } from 'react';

import ExpenseRow from './ExpenseRow.jsx';

const propTypes = {
  triggerId: PropTypes.string,
  expenseIdOnEdition: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  expenseIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  expensesById: PropTypes.objectOf(PropTypes.object).isRequired,
  deleteHandler: PropTypes.func.isRequired,
  editHandler: PropTypes.func.isRequired,
};

function ExpensesTable(props) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Comment</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {props.expenseIds.map(id => <ExpenseRow
          key={id}
          id={id}
          expense={props.expensesById[id]}
          triggerId={props.triggerId}
          isDisabled={props.isDisabled}
          isOnEdition={props.expenseIdOnEdition === id}
          deleteHandler={props.deleteHandler}
          editHandler={props.editHandler}
        />)}
      </tbody>
    </table>
  );
}

ExpensesTable.propTypes = propTypes;

export default ExpensesTable;
