import React, { PropTypes } from 'react';

const propTypes = {
  label: PropTypes.string.isRequired,
  labelClass: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
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
  return (
    <div className="form-group">
      <label
        htmlFor={`${props.form}_${props.field}`}
        className={props.labelClass}
      >
        {props.label}
      </label>

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
