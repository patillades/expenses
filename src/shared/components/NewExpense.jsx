import React from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';

import { InlineInput } from './Input.jsx';
import { InlineButton } from './Button.jsx';

function NewExpense(props) {
  return (
    <form className="form-inline">
      <fieldset disabled={props.isDisabled}>
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
        />

        <InlineInput
          type="number"
          id="amount"
          placeholder="amount"
          label="amount"
          isRequired
          changeHandler={props.inputChangeHandler}
        />

        <InlineInput
          type="text"
          id="comment"
          placeholder="comment"
          label="comment"
          isRequired={false}
          changeHandler={props.inputChangeHandler}
        />

        <InlineButton
          txt="Add expense"
          isLoading={props.isDisabled}
          clickHandler={props.submitHandler}
        />
      </fieldset>
    </form>
  );
}

export default NewExpense;
