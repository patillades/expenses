import React, { PropTypes } from 'react';

import Button from './Button.jsx';

const propTypes = {
  hasLogOutBtn: PropTypes.bool.isRequired,
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool,
  clickHandler: PropTypes.func,
};

function Header(props) {
  let button;

  if (props.hasLogOutBtn) {
    button = <Button
      id="logOutBtn"
      triggerId={props.triggerId}
      txt="Log out"
      title="Log out"
      isLoading={props.isDisabled}
      clickHandler={props.clickHandler}
      className="btn-link pull-right"
      isInline
    />;
  } else {
    button = null;
  }

  return (
    <div>

      <div className="page-header">
        <h1>
          <span>Expenses tracker</span>

          {button}
        </h1>
      </div>
    </div>
  );
}

Header.propTypes = propTypes;

export default Header;
