import expect from 'expect';
import merge from 'lodash/merge';

import modals, { initialState } from 'reducers/modals';
import { action, inputChange } from 'actions/actions';
import { initRequest, requestSucceeded, requestFailed } from 'actions/requestActions';
import {
  GET_EXPENSES_REQUEST,
  CLOSE_MODAL,
  OPEN_INPUT_MODAL,
  MODAL_INPUT_CHANGE,
  CREATE_CATEGORY_REQUEST,
} from 'constants/actionTypes';

describe('modals reducer', () => {
  let state;
  let initialStateClone;

  before(() => { initialStateClone = merge({}, initialState); });

  it('should return initial state on default action', () => {
    const newState = modals(undefined, {});

    expect(newState).toEqual(initialState);

    state = newState;
  });

  it('should not open the message modal on GET_EXPENSES_REQUEST_SUCCESS', () => {
    const newState = modals(state, requestSucceeded(GET_EXPENSES_REQUEST, []));

    expect(newState.msgModal).toEqual(initialState.msgModal);

    state = newState;
  });

  it('should open the message modal on GET_EXPENSES_REQUEST_ERROR', () => {
    const msg = 'error';
    const newState = modals(state, requestFailed(GET_EXPENSES_REQUEST, msg));

    expect(newState.msgModal).toEqual({ isOpen: true, msg });

    state = newState;
  });

  it('should close the message modal on CLOSE_MODAL', () => {
    const newState = modals(state, action(CLOSE_MODAL));

    expect(newState.msgModal).toEqual(initialState.msgModal);

    state = newState;
  });

  it('should open the input modal on OPEN_INPUT_MODAL', () => {
    const newState = modals(state, action(OPEN_INPUT_MODAL));

    expect(newState.inputModal.isOpen).toBe(true);

    state = newState;
  });

  it('should update the input modal on MODAL_INPUT_CHANGE', () => {
    const value = 'test';
    const newState = modals(state, inputChange(MODAL_INPUT_CHANGE, null, null, value));

    expect(newState.inputModal.inputValue).toBe(value);

    state = newState;
  });

  it('should close the input modal on CREATE_CATEGORY_REQUEST', () => {
    const newState = modals(state, initRequest(
      CREATE_CATEGORY_REQUEST,
      { triggerId: 'inputModalBtn' }
    ));

    expect(newState.inputModal.isOpen).toBe(false);
    expect(newState.inputModal.inputValue).toBe('');

    state = newState;
  });

  it('should not mutate initial state', () => {
    expect(initialState).toEqual(initialStateClone);
  });
});
