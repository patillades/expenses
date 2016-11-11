import {
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  CREATE_EXPENSE_REQUEST,
  DELETE_EXPENSE_REQUEST
} from './actionTypes';

const MODAL_MESSAGES = {
  [REGISTRATION_REQUEST]: 'registration successful',
  [LOGIN_REQUEST]: 'login successful',
  [CREATE_EXPENSE_REQUEST]: 'expense created successfully',
  [DELETE_EXPENSE_REQUEST]: 'expense deleted successfully',
};

export { MODAL_MESSAGES };
