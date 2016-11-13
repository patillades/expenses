import React, { PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';

import WeeklyExpenseRow from './WeeklyExpenseRow.jsx';

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  expenseIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  expensesById: PropTypes.objectOf(PropTypes.object).isRequired,
};

function ExpensesPerWeek(props) {
  const formClass = classnames({ hidden: !props.isVisible });

  const expensesPerWeek = groupExpensesByWeek(props.expenseIds, props.expensesById);

  return (
    <form className={formClass}>
      <fieldset disabled={props.isDisabled}>
        <table className="table">
          <thead>
            <tr>
              <th>Week</th>
              <th>Total</th>
              <th>Daily average</th>
            </tr>
          </thead>

          <tbody>
            {Object.keys(expensesPerWeek).map(week => <WeeklyExpenseRow
              key={week}
              week={week}
              expenses={expensesPerWeek[week]}
            />)}
          </tbody>
        </table>
      </fieldset>
    </form>
  );
}

/**
 * A date in "M/D/YYYY - M/D/YYYY" format, representing the start and dates of a week
 *
 * @typedef {string} WeekStartEndDates
 */

/**
 *
 * @param {ObjectId[]} expenseIds
 * @param {ExpensesById} expensesById
 * @return {object.<WeekStartEndDates, {total: number}>}
 */
function groupExpensesByWeek(expenseIds, expensesById) {
  return expenseIds.reduce((result, id) => {
    const expense = expensesById[id];

    const weekNum = moment(expense.date).week();
    const weekStart = moment().week(weekNum);
    const weekEnd = moment(weekStart).add(6, 'd');

    const key = `${weekStart.format('M/D/YYYY')} - ${weekEnd.format('M/D/YYYY')}`;

    if (!result[key]) {
      result[key] = { total: 0 };
    }

    result[key].total += expense.amount;

    return result;
  }, {});
}

ExpensesPerWeek.propTypes = propTypes;

export default ExpensesPerWeek;
