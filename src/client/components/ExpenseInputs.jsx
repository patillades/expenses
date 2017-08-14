import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { upperFirst } from 'lodash';

import { InlineInput } from './Input.jsx';
import { InlineButton } from './Button.jsx';
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
  isOnEdition: PropTypes.bool,
  isDisabled: PropTypes.bool.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  dateChangeHandler: PropTypes.func.isRequired,
  newCategoryBtnHandler: PropTypes.func,
  expenseCategories: PropTypes.object.isRequired,
  expenseCategoryChangeHandler: PropTypes.func.isRequired,
};

/**
 * Shorthand function for the date picker
 *
 * @param {object} props
 * @return {ReactDatePicker}
 */
function DateInput(props) {
  return (
    <DatePicker
      selected={props.date}
      onChange={props.dateChangeHandler}
      className="form-control"
    />
  );
}

/**
 * Shorthand function for the row inputs
 *
 * @param {object} props
 * @param {string} field - Form field, and also its placehodler and label
 * @param {boolean} [isRequired=false]
 * @param {string} [type='text']
 * @return {ReactElement}
 */
function FormInput(props, field, isRequired = false, type = 'text') {
  return (
    <InlineInput
      type={type}
      placeholder={field}
      label={upperFirst(field)}
      isRequired={isRequired}
      changeHandler={props.inputChangeHandler}
      value={props[field] ? props[field] : ''}
      form={props.form}
      field={field}
    />
  );
}

/**
 * Shorthand function for the category select
 *
 * @param {object} props
 * @return {ReactElement}
 */
function ExpenseCategorySelect(props) {
  return (
    <Select
      changeHandler={props.expenseCategoryChangeHandler}
      value={props.expenseCategoryId}
      form={props.form}
      field="expenseCategoryId"
      optionIds={props.expenseCategories.ids}
      optionsById={props.expenseCategories.byId}
    />
  );
}

function ExpenseInputs(props) {
  if (props.isOnEdition) {
    return (
      <tr>
        <td>
          <div style={{ position: 'relative' }}>
            {DateInput(props)}
          </div>
        </td>
        <td>{FormInput(props, 'amount', true, 'number')}</td>
        <td>{ExpenseCategorySelect(props)}</td>
        <td>{FormInput(props, 'description', true)}</td>
        <td>{FormInput(props, 'comment')}</td>
        {props.children}
      </tr>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="col-xs-2">
          {DateInput(props)}
        </div>

        <div className="col-xs-2">
          {FormInput(props, 'amount', true, 'number')}
        </div>

        <div className="col-xs-6">
          {ExpenseCategorySelect(props)}
        </div>

        <div className="col-xs-2">
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
      </div>

      {FormInput(props, 'description', true)}

      {FormInput(props, 'comment')}

      {props.children}
    </div>
  );
}

ExpenseInputs.propTypes = propTypes;

export default ExpenseInputs;
