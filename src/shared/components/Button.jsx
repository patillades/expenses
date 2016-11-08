import React, { PropTypes } from 'react';
import Loader from 'halogen/PulseLoader';
import classnames from 'classnames';

const propTypes = {
  txt: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func.isRequired,
};

function Button(props) {
  const txtClass = classnames({ hidden: props.isLoading });
  const loaderClass = classnames({ hidden: !props.isLoading });

  return (
    <button
      className="btn btn-primary center-block"
      onClick={props.clickHandler}
    >
      <span className={txtClass}>
        {props.txt}
      </span>

      <Loader
        className={loaderClass}
        color="#fff"
        size="14px"
        margin="4px"
      />
    </button>
  );
}

Button.propTypes = propTypes;

export default Button;
