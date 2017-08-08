const REQUEST = '_REQUEST';
const ERROR = '_ERROR';
const SUCCESS = '_SUCCESS';

const INPUT_CHANGE = 'INPUT_CHANGE';
const LOGIN_REGISTRATION_INPUT_CHANGE = `LOGIN_REGISTRATION_${INPUT_CHANGE}`;
const EXPENSES_INPUT_CHANGE = `EXPENSES_${INPUT_CHANGE}`;
const EXPENSE_DATE_CHANGE = 'DATE_CHANGE';
const FILTER_DATE_CHANGE = 'FILTER_DATE_CHANGE';
const FILTER_INPUT_CHANGE = 'FILTER_INPUT_CHANGE';
const CLEAR_EXPENSES_FILTER = 'CLEAR_EXPENSES_FILTER';
const TOGGLE_DAY_WEEK_EXPENSES = 'TOGGLE_DAY_WEEK_EXPENSES';
const CLOSE_MODAL = 'CLOSE_MODAL';
const SESSION_EXPIRED = 'SESSION_EXPIRED';
const LOG_OUT = 'LOG_OUT';

const REGISTRATION_REQUEST = `REGISTRATION${REQUEST}`;

const LOGIN_REQUEST = `LOGIN${REQUEST}`;

const CREATE_EXPENSE_REQUEST = `CREATE_EXPENSE${REQUEST}`;

const GET_EXPENSES_REQUEST = `GET_EXPENSES${REQUEST}`;
const GET_EXPENSES_REQUEST_ON_LOAD = `${GET_EXPENSES_REQUEST}_ON_LOAD`;

const DELETE_EXPENSE_REQUEST = `DELETE_EXPENSE${REQUEST}`;

const EDIT_EXPENSE = 'EDIT_EXPENSE';
const CANCEL_EDIT_EXPENSE = `CANCEL_${EDIT_EXPENSE}`;
const EDIT_EXPENSE_REQUEST = EDIT_EXPENSE + REQUEST;

const OPEN_INPUT_MODAL = 'OPEN_INPUT_MODAL';
const MODAL_INPUT_CHANGE = 'MODAL_INPUT_CHANGE';

const CREATE_CATEGORY_REQUEST = `CREATE_CATEGORY${REQUEST}`;

const GET_EXPENSE_CATEGORIES_REQUEST = `GET_EXPENSE_CATEGORIES${REQUEST}`;

const CHANGE_CATEGORY_EXPENSE = 'CHANGE_CATEGORY_EXPENSE';

export {
  REQUEST,
  ERROR,
  SUCCESS,
  LOGIN_REGISTRATION_INPUT_CHANGE,
  EXPENSES_INPUT_CHANGE,
  EXPENSE_DATE_CHANGE,
  FILTER_DATE_CHANGE,
  FILTER_INPUT_CHANGE,
  CLEAR_EXPENSES_FILTER,
  TOGGLE_DAY_WEEK_EXPENSES,
  CLOSE_MODAL,
  SESSION_EXPIRED,
  LOG_OUT,
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
  CREATE_EXPENSE_REQUEST,
  GET_EXPENSES_REQUEST,
  GET_EXPENSES_REQUEST_ON_LOAD,
  DELETE_EXPENSE_REQUEST,
  EDIT_EXPENSE,
  CANCEL_EDIT_EXPENSE,
  EDIT_EXPENSE_REQUEST,
  OPEN_INPUT_MODAL,
  MODAL_INPUT_CHANGE,
  CREATE_CATEGORY_REQUEST,
  GET_EXPENSE_CATEGORIES_REQUEST,
  CHANGE_CATEGORY_EXPENSE,
};
