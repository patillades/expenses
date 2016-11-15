import React, { PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import merge from 'lodash/merge';
import sortBy from 'lodash/sortBy';

import WeeklyExpenseRow from './WeeklyExpenseRow.jsx';

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  expenseIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  expensesById: PropTypes.objectOf(PropTypes.object).isRequired,
};

/**
 *
 * @param {ObjectId[]} expenseIds
 * @param {ExpensesById} expensesById
 * @return {{weekNums: number[], totalPerWeekNum: object.<string, {total: number}>}}
 */
function groupExpensesByWeek(expenseIds, expensesById) {
  // get the total amount spent per week number
  const totalPerWeekNum = expenseIds.reduce((result, id) => {
    const expense = expensesById[id];

    const weekNum = moment(expense.date).week();

    const totalPerWeek = merge({}, result);

    if (!totalPerWeek[weekNum]) {
      totalPerWeek[weekNum] = { total: expense.amount };
    } else {
      totalPerWeek[weekNum].total += expense.amount;
    }

    return totalPerWeek;
  }, {});

  // sort the week numbers descending
  const sortedWeekNums = sortBy(
    Object.keys(totalPerWeekNum),
    weekNum => -Number(weekNum)
  );

  // fill the array with the weeks where the user hasn't spent
  const weekNums = sortedWeekNums.reduce((result, el, index, array) => {
    const weeks = [];
    let weekNum = Number(el);

    weeks.push(weekNum);

    while (
      index < array.length
      && (weekNum - 1) > Number(array[index + 1])
    ) {
      weekNum -= 1;

      weeks.push(weekNum);
    }

    return result.concat(weeks);
  }, []);

  return { weekNums, totalPerWeekNum };
}

function ExpensesPerWeek(props) {
  const tblClass = classnames('table', { hidden: !props.isVisible });

  const { weekNums, totalPerWeekNum } = groupExpensesByWeek(props.expenseIds, props.expensesById);

  let body;

  if (weekNums.length) {
    body = weekNums.map(weekNum => <WeeklyExpenseRow
      key={`week_${weekNum}`}
      weekNum={weekNum}
      expenses={totalPerWeekNum[weekNum]}
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
