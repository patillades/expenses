import React, { PropTypes } from 'react';

const propTypes = {
  week: PropTypes.string.isRequired,
  expenses: PropTypes.shape({
    total: PropTypes.number.isRequired,
  }).isRequired,
};

function WeeklyExpenseRow(props) {
  const avg = props.expenses.total / 7;

  return (
    <tr>
      <td>{props.week}</td>
      <td>{props.expenses.total}</td>
      <td>{avg.toFixed(2)}</td>
    </tr>
  );
}

WeeklyExpenseRow.propTypes = propTypes;

export default WeeklyExpenseRow;
