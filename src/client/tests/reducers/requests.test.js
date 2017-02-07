import expect from 'expect';
import merge from 'lodash/merge';

import requests, { initialState } from 'reducers/requests';
import { initRequest, requestSucceeded, requestFailed } from 'actions/requestActions';
import {
  REGISTRATION_REQUEST,
} from 'constants/actionTypes';

describe('requests reducer', () => {
  let state;
  let initialStateClone;

  before(() => { initialStateClone = merge({}, initialState); });

  it('should return initial state on default action', () => {
    const newState = requests(undefined, {});

    expect(newState).toEqual(initialState);

    state = newState;
  });

  it('should set isFetching to true when a request is initialized', () => {
    const triggerId = 'registrationBtn';
    const newState = requests(state, initRequest(REGISTRATION_REQUEST, { triggerId }));

    expect(newState).toEqual({
      isFetching: true,
      triggerId,
    });

    state = newState;
  });

  it('should reset state when a request succeeds', () => {
    const newState = requests(state, requestSucceeded(
      REGISTRATION_REQUEST,
      { id: '1', token: 'token' }
    ));

    expect(newState).toEqual(initialState);

    state = newState;
  });

  it('should reset state when a request fails', () => {
    const triggerId = 'registrationBtn';
    let newState = requests(state, initRequest(REGISTRATION_REQUEST, { triggerId }));

    expect(newState).toEqual({
      isFetching: true,
      triggerId,
    });

    state = newState;

    newState = requests(state, requestFailed(
      REGISTRATION_REQUEST,
      'error'
    ));

    expect(newState).toEqual(initialState);

    state = newState;
  });

  it('should not mutate initial state', () => {
    expect(initialState).toEqual(initialStateClone);
  });
});
