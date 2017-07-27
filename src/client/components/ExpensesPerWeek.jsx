import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import merge from 'lodash/merge';

import WeeklyExpenseRow from './WeeklyExpenseRow.jsx';

const has = Object.prototype.hasOwnProperty;

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  expenseIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  expensesById: PropTypes.objectOf(PropTypes.object).isRequired,
};

/**
 * @typedef {number} YearKey
 */

/**
 * @typedef {number} IsoWeekKey
 */

/**
 * @typedef {object.<YearKey, object.<IsoWeekKey, {total: number}>>} YearWeekTotals
 */

/**
 * @typedef {object} TotalPerWeek
 * @property {number} year
 * @property {number} isoWeek
 * @property {number} total
 */

/**
 * Starting from the last known date where the user had an expense, iterate until the first known
 * date in order to get the weeks where the user didn't make expenses. While getting the weeks, fill
 * them with the total amount spent calculated previously
 *
 * @param {YearWeekTotals} yearWeekTotals
 * @param {MomentDate} lastDate
 * @param {MomentDate} firstDate
 * @param {TotalPerWeek[]} [weeklyTotalsArr=[]]
 * @return {TotalPerWeek[]}
 */
function setTotalsPerWeek(yearWeekTotals, lastDate, firstDate, weeklyTotalsArr = []) {
  const weeklyTotals = weeklyTotalsArr.slice();

  const year = lastDate.year();
  const isoWeek = lastDate.isoWeek();
  let total = 0;

  if (
    has.call(yearWeekTotals, year)
    && has.call(yearWeekTotals[year], isoWeek)
  ) {
    ({ total } = yearWeekTotals[year][isoWeek]);
  }

  weeklyTotals.push({
    year,
    isoWeek,
    total,
  });

  const prevWeek = moment(lastDate).subtract(1, 'w');

  if (prevWeek.isBefore(firstDate, 'isoWeek')) {
    return weeklyTotals;
  }

  return setTotalsPerWeek(yearWeekTotals, prevWeek, firstDate, weeklyTotals);
}

/**
 *
 * @param {ObjectId[]} expenseIds
 * @param {ExpensesById} expensesById
 * @return {TotalPerWeek[]}
 */
function getWeeklyTotals(expenseIds, expensesById) {
  if (!expenseIds.length) {
    return [];
  }

  /**
   * Iterate the expense ids to group them by total amount spent per isoWeek and year
   *
   * @type {YearWeekTotals}
   */
  const yearWeekTotals = expenseIds.reduce((resultObj, id) => {
    const result = merge({}, resultObj);

    const expense = expensesById[id];
    const date = moment(expense.date);
    const year = date.year();
    const isoWeek = date.isoWeek();

    if (!has.call(result, year)) {
      result[year] = {};
    }

    if (!has.call(result[year], isoWeek)) {
      result[year][isoWeek] = { total: 0 };
    }

    result[year][isoWeek].total += expense.amount;

    return result;
  }, {});

  return setTotalsPerWeek(
    yearWeekTotals,
    moment(expensesById[expenseIds[0]].date),
    moment(expensesById[expenseIds[expenseIds.length - 1]].date)
  );
}

function ExpensesPerWeek(props) {
  const tblClass = classnames('table', { hidden: !props.isVisible });

  const weeklyTotals = getWeeklyTotals(props.expenseIds, props.expensesById);

  let body;

  if (weeklyTotals.length) {
    body = weeklyTotals.map(el => <WeeklyExpenseRow
      key={`${el.year}_${el.isoWeek}`}
      {...el}
    />);
  } else {
    body = (
      <tr>
        <td colSpan="3" className="text-center">
          There are no expenses to show
        </td>
      </tr>
    );
  }

  return (
    <table className={tblClass}>
      <thead>
        <tr>
          <th>Week</th>
          <th>Total</th>
          <th>Daily average</th>
        </tr>
      </thead>

      <tbody>
        {body}
      </tbody>
    </table>
  );
}

ExpensesPerWeek.propTypes = propTypes;

export default ExpensesPerWeek;
