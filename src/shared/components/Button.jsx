import React, { PropTypes } from 'react';
import Loader from 'halogen/PulseLoader';
import classnames from 'classnames';

const propTypes = {
  txt: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func.isRequired,
  isInline: PropTypes.bool,
};

function Button(props) {
  const btnClass = classnames('btn', 'btn-primary', { 'center-block': !props.isInline });
  const txtClass = classnames({ hidden: props.isLoading });
  const loaderClass = classnames({ hidden: !props.isLoading });

  return (
    <button
      className={btnClass}
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

function InlineButton(props) {
  return <Button isInline {...props} />;
}

export { InlineButton };
export default Button;
