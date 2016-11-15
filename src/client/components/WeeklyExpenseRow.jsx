import React, { PropTypes } from 'react';
import moment from 'moment';

const propTypes = {
  year: PropTypes.number.isRequired,
  isoWeek: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

function WeeklyExpenseRow(props) {
  let strIsoWeek = `${props.isoWeek}`;

  // add a leading 0 when the week only has 1 digit because the format expected by moment when
  // generating dates through year and ISO week requires "ww" (2 digits)
  if (strIsoWeek.length === 1) {
    strIsoWeek = `0${strIsoWeek}`;
  }

  const weekStart = moment(`${props.year}W${strIsoWeek}1`);
  const weekEnd = moment(weekStart).add(6, 'd');

  const week = `${weekStart.format('M/D/YYYY')} - ${weekEnd.format('M/D/YYYY')}`;

  const avg = props.total / 7;

  return (
    <tr>
      <td>{week}</td>
      <td>{props.total}</td>
      <td>{avg.toFixed(2)}</td>
    </tr>
  );
}

WeeklyExpenseRow.propTypes = propTypes;

export default WeeklyExpenseRow;
