import React, { PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import sortBy from 'lodash/sortBy';

import WeeklyExpenseRow from './WeeklyExpenseRow.jsx';

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  expenseIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  expensesById: PropTypes.objectOf(PropTypes.object).isRequired,
};

function ExpensesPerWeek(props) {
  const tblClass = classnames('table', { hidden: !props.isVisible });

  const { weekNums, totalPerWeekNum } = groupExpensesByWeek(props.expenseIds, props.expensesById);

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
        {
          weekNums.length
            ? weekNums.map(weekNum => <WeeklyExpenseRow
                key={`week_${weekNum}`}
                weekNum={weekNum}
                expenses={totalPerWeekNum[weekNum]}
              />)
            : <tr>
                <td colSpan="3" className="text-center">
                  There are no expenses to show
                </td>
              </tr>
        }
      </tbody>
    </table>
  );
}

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

    if (!result[weekNum]) {
      result[weekNum] = { total: 0 };
    }

    result[weekNum].total += expense.amount;

    return result;
  }, {});

  // sort the week numbers descending
  const sortedWeekNums = sortBy(
    Object.keys(totalPerWeekNum),
    weekNum => -Number(weekNum)
  );

  // fill the array with the weeks where the user hasn't spent
  const weekNums = sortedWeekNums.reduce((result, el, index, array) => {
    let weekNum = Number(el);

    result.push(weekNum);

    while (
      index < array.length
      && --weekNum > Number(array[index + 1])
    ) {
      result.push(weekNum);
    }

    return result;
  }, []);

  return { weekNums, totalPerWeekNum };
}

ExpensesPerWeek.propTypes = propTypes;

export default ExpensesPerWeek;
