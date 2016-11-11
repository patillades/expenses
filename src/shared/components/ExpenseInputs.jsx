import React, { PropTypes } from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';

import { InlineInput } from './Input.jsx';

const propTypes = {
  formPrefix: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  time: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
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
          id={`${props.formPrefix}_description`}
          placeholder="description"
          label="Description"
          isRequired
          changeHandler={props.inputChangeHandler}
          value={props.description}
        />
      </td>

      <td>
        <InlineInput
          type="number"
          id={`${props.formPrefix}_amount`}
          placeholder="amount"
          label="amount"
          isRequired
          changeHandler={props.inputChangeHandler}
          value={props.amount}
        />
      </td>

      <td>
        <InlineInput
          type="text"
          id={`${props.formPrefix}_comment`}
          placeholder="comment"
          label="comment"
          isRequired={false}
          changeHandler={props.inputChangeHandler}
          value={props.comment}
        />
      </td>

      {props.children}
    </tr>
  );
}

ExpenseInputs.propTypes = propTypes;

export default ExpenseInputs;
