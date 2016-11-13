import React, { PropTypes } from 'react';
import classnames from 'classnames';

const propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

function ExpensesPerWeek(props) {
  const divClass = classnames({ hidden: !props.isVisible });

  return (
    <div className={divClass}>
      exp per week
    </div>
  );
}

ExpensesPerWeek.propTypes = propTypes;

export default ExpensesPerWeek;
