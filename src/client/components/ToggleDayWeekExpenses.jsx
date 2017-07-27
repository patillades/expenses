import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button.jsx';

const propTypes = {
  view: PropTypes.object.isRequired,
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func.isRequired,
};

function ToggleDayWeekExpenses(props) {
  const txt = `Switch to expenses per ${props.view.daily ? 'week' : 'day'}`;

  return (
    <Button
      id="toggleDayWeekBtn"
      className="btn-info"
      triggerId={props.triggerId}
      txt={txt}
      isLoading={props.isDisabled}
      clickHandler={props.clickHandler}
    />
  );
}

ToggleDayWeekExpenses.propTypes = propTypes;

export default ToggleDayWeekExpenses;
