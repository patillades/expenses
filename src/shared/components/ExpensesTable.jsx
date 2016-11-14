import React, { PropTypes } from 'react';
import classnames from 'classnames';

import ExpenseRow from './ExpenseRow.jsx';

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  editObj: PropTypes.object.isRequired,
  triggerId: PropTypes.string,
  expenseIdOnEdition: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  expenseIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  expensesById: PropTypes.objectOf(PropTypes.object).isRequired,
  deleteHandler: PropTypes.func.isRequired,
  editHandler: PropTypes.func.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  timeChangeHandler: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  editSubmitHandler: PropTypes.func.isRequired,
  cancelEditHandler: PropTypes.func.isRequired,
};

function ExpensesTable(props) {
  const formClass = classnames({ hidden: !props.isVisible });

  return (
    <form className={formClass}>
      <fieldset disabled={props.isDisabled}>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Comment</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

          <tbody>
            {
              props.expenseIds.length
                ? props.expenseIds.map(id => <ExpenseRow
                    key={id}
                    id={id}
                    editObj={props.editObj}
                    expense={props.expensesById[id]}
                    triggerId={props.triggerId}
                    isDisabled={props.isDisabled}
                    isOnEdition={props.expenseIdOnEdition === id}
                    deleteHandler={props.deleteHandler}
                    editHandler={props.editHandler}
                    dateChangeHandler={props.dateChangeHandler}
                    timeChangeHandler={props.timeChangeHandler}
                    inputChangeHandler={props.inputChangeHandler}
                    editSubmitHandler={props.editSubmitHandler}
                    cancelEditHandler={props.cancelEditHandler}
                  />)
                : <tr>
                    <td colSpan="6" className="text-center">There are no expenses to show</td>
                  </tr>
            }
          </tbody>
        </table>
      </fieldset>
    </form>
  );
}

ExpensesTable.propTypes = propTypes;

export default ExpensesTable;
