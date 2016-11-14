import React, { PropTypes } from 'react';

const propTypes = {
  label: PropTypes.string,
  labelClass: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
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
        type={props.type}
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
