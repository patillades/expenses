import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { PulseLoader } from 'react-spinners';

import { GET_EXPENSES_REQUEST_ON_LOAD } from 'constants/actionTypes';
import ExpenseRow from './ExpenseRow.jsx';

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
  editObj: PropTypes.object.isRequired,
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  expenseIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  expensesById: PropTypes.object.isRequired,
  expenseCategories: PropTypes.object.isRequired,
  cancelEditHandler: PropTypes.func.isRequired,
  expenseCategoryChangeHandler: PropTypes.func.isRequired,
};

function ExpensesTable(props) {
  const formClass = classnames({ hidden: !props.isVisible });

  let body;

  if (props.triggerId === GET_EXPENSES_REQUEST_ON_LOAD) {
    body = (
      <tr>
        <td colSpan="6" className="text-center">
          <PulseLoader
            color="#000"
            size={14}
            margin={4}
          />
        </td>
      </tr>
    );
  } else if (props.expenseIds.length) {
    body = props.expenseIds.map(id => <ExpenseRow
      key={id}
      id={id}
      editObj={props.editObj}
      expense={props.expensesById[id]}
      expenseCategories={props.expenseCategories}
      triggerId={props.triggerId}
      isDisabled={props.isDisabled}
      isOnEdition={props.expenseIdOnEdition === id}
      deleteHandler={props.deleteHandler}
      editHandler={props.editHandler}
      dateChangeHandler={props.dateChangeHandler}
      inputChangeHandler={props.inputChangeHandler}
      editSubmitHandler={props.editSubmitHandler}
      cancelEditHandler={props.cancelEditHandler}
      expenseCategoryChangeHandler={props.expenseCategoryChangeHandler}
    />);
  } else {
    body = (
      <tr>
        <td colSpan="6" className="text-center">There are no expenses to show</td>
      </tr>
    );
  }

  return (
    <form className={formClass}>
      <fieldset disabled={props.isDisabled}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Comment</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

          <tbody>
            {body}
          </tbody>
        </table>
      </fieldset>
    </form>
  );
}

ExpensesTable.propTypes = propTypes;

export default ExpensesTable;
