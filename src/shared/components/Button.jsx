import React, { PropTypes } from 'react';

const propTypes = {
  txt: PropTypes.string.isRequired,
};

function Button(props) {
  return (
    <button
      className="btn btn-primary center-block"
      onClick={props.clickHandler}
    >
      {props.txt}
    </button>
  );
}

Button.propTypes = propTypes;

export default Button;
