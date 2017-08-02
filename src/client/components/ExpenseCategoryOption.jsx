import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

function ExpenseCategoryOption(props) {
  return (
    <option value={props.id}>
      {props.title}
    </option>
  );
}

ExpenseCategoryOption.propTypes = propTypes;

export default ExpenseCategoryOption;
