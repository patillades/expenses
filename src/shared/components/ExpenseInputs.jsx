import React, { PropTypes } from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';

import { InlineInput } from './Input.jsx';

const propTypes = {
  date: PropTypes.object.isRequired,
  time: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  amount: PropTypes.string,
  inputChangeHandler: PropTypes.func.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  timeChangeHandler: PropTypes.func.isRequired,
};

function ExpenseInputs(props) {
  return (
    <div>
      <DatePicker
        selected={props.date}
        onChange={props.dateChangeHandler}
      />

      <TimePicker
        placeholder="Time"
        showSecond={false}
        value={props.time}
        onChange={props.timeChangeHandler}
      />

      <InlineInput
        type="text"
        id="description"
        placeholder="description"
        label="Description"
        isRequired
        changeHandler={props.inputChangeHandler}
        value={props.description}
      />

      <InlineInput
        type="number"
        id="amount"
        placeholder="amount"
        label="amount"
        isRequired
        changeHandler={props.inputChangeHandler}
        value={props.amount}
      />

      <InlineInput
        type="text"
        id="comment"
        placeholder="comment"
        label="comment"
        isRequired={false}
        changeHandler={props.inputChangeHandler}
        value={props.comment}
      />
    </div>
  );
}

export default ExpenseInputs;
