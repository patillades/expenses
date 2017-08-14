import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  label: PropTypes.string,
  labelClass: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  changeHandler: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  form: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
};

function Input(props) {
  let label;

  if (props.label) {
    label = (
      <label
        htmlFor={`${props.form}_${props.field}`}
        className={props.labelClass}
      >
        {props.label}
      </label>
    );
  } else {
    label = null;
  }

  return (
    <div className="form-group">
      {label}

      <input
        type={props.type ? props.type : 'text'}
        className="form-control"
        id={`${props.form}_${props.field}`}
        placeholder={props.placeholder}
        required={props.isRequired}
        onChange={props.changeHandler}
        value={props.value}
        data-form={props.form}
        data-field={props.field}
      />
    </div>
  );
}

Input.propTypes = propTypes;

function InlineInput(props) {
  return <Input labelClass="sr-only" {...props} />;
}

export { InlineInput };
export default Input;
