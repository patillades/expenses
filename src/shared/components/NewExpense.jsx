import React from 'react';
import DatePicker from 'react-datepicker';

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

        <InlineInput
          type="text"
          id="description"
          placeholder="description"
          label="Description"
          isRequired
          onChange={props.changeHandler}
        />

        <InlineInput
          type="number"
          id="amount"
          placeholder="amount"
          label="amount"
          isRequired
          onChange={props.changeHandler}
        />

        <InlineInput
          type="text"
          id="comment"
          placeholder="comment"
          label="comment"
          isRequired={false}
          onChange={props.changeHandler}
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
