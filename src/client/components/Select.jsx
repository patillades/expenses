import React from 'react';
import PropTypes from 'prop-types';

import ExpenseCategoryOption from './ExpenseCategoryOption.jsx';

const propTypes = {
  changeHandler: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

const emptyOption = <ExpenseCategoryOption
  key="empty"
  id=""
  title="- no category -"
/>;

function Select(props) {
  const options = [emptyOption].concat(
    props.options.map(category => <ExpenseCategoryOption
      key={category.id}
      {...category}
    />)
  );

  return (
    <select
      onChange={props.changeHandler}
      value={props.value}
      data-form={props.form}
      data-field={props.field}
    >
      {options}
    </select>
  );
}

Select.propTypes = propTypes;

export default Select;
