import {
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  CREATE_EXPENSE_REQUEST,
  DELETE_EXPENSE_REQUEST,
  EDIT_EXPENSE_REQUEST,
  CREATE_EXPENSE_CATEGORY_REQUEST,
  SESSION_EXPIRED,
} from './actionTypes';

const MODAL_MESSAGES = {
  // @see this message MUST be the same as SESSION_EXPIRED@src/server/rules/authorize.js
  [SESSION_EXPIRED]: 'Your session has expired, please log in again',
  [REGISTRATION_REQUEST]: 'registration successful',
  [LOGIN_REQUEST]: 'login successful',
  [CREATE_EXPENSE_REQUEST]: 'expense created successfully',
  [DELETE_EXPENSE_REQUEST]: 'expense deleted successfully',
  [EDIT_EXPENSE_REQUEST]: 'expense updated successfully',
  [CREATE_EXPENSE_CATEGORY_REQUEST]: 'category created successfully',
};

export default MODAL_MESSAGES;
