import React, { PropTypes } from 'react';

const propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired,
};

function Input(props) {
  return (
    <div className="form-group">
      <label htmlFor={props.id}>{props.label}</label>

      <input
        type={props.type}
        className="form-control"
        id={props.id}
        placeholder={props.placeholder}
        onChange={props.changeHandler}
      />
    </div>
  );
}

Input.propTypes = propTypes;

export default Input;
