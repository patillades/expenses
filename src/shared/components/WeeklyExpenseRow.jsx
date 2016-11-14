import React, { PropTypes } from 'react';
import moment from 'moment';

const propTypes = {
  weekNum: PropTypes.number.isRequired,
  expenses: PropTypes.shape({
    total: PropTypes.number.isRequired,
  }),
};

function WeeklyExpenseRow(props) {
  const weekStart = moment().week(props.weekNum);
  const weekEnd = moment(weekStart).add(6, 'd');

  const week = `${weekStart.format('M/D/YYYY')} - ${weekEnd.format('M/D/YYYY')}`;

  const total = props.expenses ? props.expenses.total : 0;
  const avg = total / 7;

  return (
    <tr>
      <td>{week}</td>
      <td>{total}</td>
      <td>{avg.toFixed(2)}</td>
    </tr>
  );
}

WeeklyExpenseRow.propTypes = propTypes;

export default WeeklyExpenseRow;
