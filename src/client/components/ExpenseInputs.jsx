import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';

import { InlineInput } from './Input.jsx';
import { InlineButton } from './Button.jsx';
import ExpenseCategoryOption from './ExpenseCategoryOption.jsx';
import Select from './Select.jsx';

const propTypes = {
  form: PropTypes.string.isRequired,
  triggerId: PropTypes.string,
  date: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  comment: PropTypes.string,
  expenseCategoryId: PropTypes.string,
  children: PropTypes.element,
  isDisabled: PropTypes.bool.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  hasNewCategoryBtn: PropTypes.bool.isRequired,
  newCategoryBtnHandler: PropTypes.func,
  expenseCategories: PropTypes.object.isRequired,
  expenseCategoryChangeHandler: PropTypes.func.isRequired,
};

function ExpenseInputs(props) {
  return (
    <div>
      <div className="row">
        <div className="col-xs-2">
          <DatePicker
            selected={props.date}
            onChange={props.dateChangeHandler}
            className="form-control"
          />
        </div>

        <div className="col-xs-2">
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
        </div>

        <div className="col-xs-6">
          <Select
            changeHandler={props.expenseCategoryChangeHandler}
            value={props.expenseCategoryId}
            form={props.form}
            field="expenseCategoryId"
            optionIds={props.expenseCategories.ids}
            optionsById={props.expenseCategories.byId}
          />
        </div>

        {
          props.hasNewCategoryBtn
            ?  <div className="col-xs-2">
              <InlineButton
                id="newCategoryBtn"
                triggerId={props.triggerId}
                className="btn-success btn-xs"
                title="new category"
                icon="plus"
                loaderSize={6}
                isLoading={props.isDisabled}
                clickHandler={props.newCategoryBtnHandler}
              />
            </div>
            : null
        }
      </div>

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

      <InlineInput
        type="text"
        placeholder="comment"
        label="comment"
        isRequired={false}
        changeHandler={props.inputChangeHandler}
        value={props.comment ? props.comment : ''}
        form={props.form}
        field="comment"
      />

      {props.children}
    </div>
  );
}

ExpenseInputs.propTypes = propTypes;

export default ExpenseInputs;
