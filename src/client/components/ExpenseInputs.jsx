import React, { PropTypes } from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';

import { InlineInput } from './Input.jsx';

const propTypes = {
  form: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  time: PropTypes.object,
  description: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  timeChangeHandler: PropTypes.func.isRequired,
};

function ExpenseInputs(props) {
  return (
    <tr>
      <td>
        <DatePicker
          selected={props.date}
          onChange={props.dateChangeHandler}
          className="form-control"
        />
      </td>

      <td>
        <TimePicker
          placeholder="Time"
          showSecond={false}
          value={props.time}
          onChange={props.timeChangeHandler}
        />
      </td>

      <td>
        <InlineInput
          type="text"
          placeholder="description"
          label="Description"
          isRequired
          changeHandler={props.inputChangeHandler}
          value={props.description}
          form={props.form}
          field="description"
        />
      </td>

      <td>
        <InlineInput
          type="number"
          placeholder="amount"
          label="amount"
          isRequired
          changeHandler={props.inputChangeHandler}
          value={props.amount}
          form={props.form}
          field="amount"
        />
      </td>

      <td>
        <InlineInput
          type="text"
          placeholder="comment"
          label="comment"
          isRequired={false}
          changeHandler={props.inputChangeHandler}
          value={props.comment}
          form={props.form}
          field="comment"
        />
      </td>

      {props.children}
    </tr>
  );
}

ExpenseInputs.propTypes = propTypes;

export default ExpenseInputs;
