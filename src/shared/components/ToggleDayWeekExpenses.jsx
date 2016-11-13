import React, { PropTypes } from 'react';

import Button from './Button.jsx';

const propTypes = {
  view: PropTypes.object.isRequired,
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func.isRequired,
};

function ToggleDayWeekExpenses(props) {
  const txt = `Expenses per ${props.view.daily ? 'week' : 'day'}`;

  return (
    <Button
      id="toggleDayWeekBtn"
      className="btn-primary btn-lg"
      triggerId={props.triggerId}
      txt={txt}
      isLoading={props.isDisabled}
      clickHandler={props.clickHandler}
    />
  );
}

ToggleDayWeekExpenses.propTypes = propTypes;

export default ToggleDayWeekExpenses;
