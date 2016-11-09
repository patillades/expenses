import React, { PropTypes } from 'react';

const propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClass: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  changeHandler: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

function Input(props) {
  return (
    <div className="form-group">
      <label
        htmlFor={props.id}
        className={props.labelClass}
      >
        {props.label}
      </label>

      <input
        type={props.type}
        className="form-control"
        id={props.id}
        placeholder={props.placeholder}
        required={props.isRequired}
        onChange={props.changeHandler}
        value={props.value}
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
