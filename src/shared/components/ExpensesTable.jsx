import React, { PropTypes } from 'react';

import ExpenseRow from './ExpenseRow.jsx';

const propTypes = {
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
  return (
    <form>
      <fieldset disabled={props.isDisabled}>
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
            />)}
          </tbody>
        </table>
      </fieldset>
    </form>
  );
}

ExpensesTable.propTypes = propTypes;

export default ExpensesTable;
