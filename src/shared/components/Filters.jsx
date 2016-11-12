import React, { PropTypes } from 'react';
import DatePicker from 'react-datepicker';

import Button from './Button.jsx';

const propTypes = {
  $gte_date: PropTypes.object,
  $lte_date: PropTypes.object,
  dateChangeHandler: PropTypes.func.isRequired,
};

function Filters(props) {
  return (
    <div className="panel-body">
      <div className="row">
        <div className="col-xs-4">
          <p className="text-center">Date</p>
        </div>

        <div className="col-xs-2">
          <p className="text-center">Description</p>
        </div>

        <div className="col-xs-4">
          <p className="text-center">Amount</p>
        </div>
      </div>

      <div className="row">
        <div className="col-xs-2">
          <p className="text-center">From</p>

          <DatePicker
            selected={props.$gte_date}
            onChange={props.dateChangeHandler.bind(null, '$gte_date')}
            className="form-control"
          />
        </div>
        <div className="col-xs-2">
          <p className="text-center">To</p>

          <DatePicker
            selected={props.$lte_date}
            onChange={props.dateChangeHandler.bind(null, '$lte_date')}
            className="form-control"
          />
        </div>

        <div className="col-xs-2"></div>
        <div className="col-xs-2"></div>
        <div className="col-xs-2"></div>

        <div className="col-xs-2">
          <Button
            id="filterExpensesBtn"
            triggerId={props.triggerId}
            txt="Apply"
            loaderSize={8}
            isLoading={props.isDisabled}
            clickHandler={props.submitHandler}
          />
        </div>
      </div>
    </div>
  );
}

Filters.propTypes = propTypes;

export default Filters;
