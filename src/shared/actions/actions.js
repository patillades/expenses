import { INPUT_CHANGE } from 'constants/actionTypes';

function inputChange(id, value) {
  return {
    type: INPUT_CHANGE,
    id,
    value,
  };
}

export { inputChange };
