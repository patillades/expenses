import {
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  CREATE_EXPENSE_REQUEST,
  DELETE_EXPENSE_REQUEST,
  EDIT_EXPENSE_REQUEST,
  SESSION_EXPIRED
} from './actionTypes';

const MODAL_MESSAGES = {
  [REGISTRATION_REQUEST]: 'registration successful',
  [LOGIN_REQUEST]: 'login successful',
  [CREATE_EXPENSE_REQUEST]: 'expense created successfully',
  [DELETE_EXPENSE_REQUEST]: 'expense deleted successfully',
  [EDIT_EXPENSE_REQUEST]: 'expense updated successfully',
  [SESSION_EXPIRED]: 'Your session has expired, please log in again',
};

export { MODAL_MESSAGES };
