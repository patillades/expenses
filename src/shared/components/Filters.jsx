import React, { PropTypes } from 'react';
import DatePicker from 'react-datepicker';

import Button from './Button.jsx';
import Input from './Input.jsx';

const propTypes = {
  $gte_date: PropTypes.object,
  $lte_date: PropTypes.object,
  $text: PropTypes.string,
  dateChangeHandler: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  clearHandler: PropTypes.func.isRequired,
};

function Filters(props) {
  return (
    <div className="panel panel-info">
      <div className="panel-heading">Filter the expenses</div>

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

          <div className="col-xs-2">
            <p className="invisible">Description</p>

            <Input
              type="text"
              isRequired={false}
              changeHandler={props.inputChangeHandler}
              value={props.$text}
              form={props.form}
              field="$text"
            />
          </div>

          <div className="col-xs-2">
            <p className="text-center">From</p>

            <Input
              type="text"
              isRequired={false}
              changeHandler={props.inputChangeHandler}
              value={props.$gte_amount}
              form={props.form}
              field="$gte_amount"
            />
          </div>

          <div className="col-xs-2">
            <p className="text-center">To</p>

            <Input
              type="text"
              isRequired={false}
              changeHandler={props.inputChangeHandler}
              value={props.$lte_amount}
              form={props.form}
              field="$lte_amount"
            />
          </div>

          <div className="col-xs-2">
            <Button
              id="filterExpensesBtn"
              triggerId={props.triggerId}
              txt="Apply"
              loaderSize={8}
              isLoading={props.isDisabled}
              clickHandler={props.submitHandler}
            />

            <Button
              id="clearExpensesFilterBtn"
              className="btn-warning"
              triggerId={props.triggerId}
              txt="Clear"
              loaderSize={8}
              isLoading={props.isDisabled}
              clickHandler={props.clearHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Filters.propTypes = propTypes;

export default Filters;