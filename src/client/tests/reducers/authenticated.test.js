import expect from 'expect';

import authenticated, { initialState } from 'reducers/authenticated';
import { action, inputChange } from 'actions/actions';
import { requestSucceeded } from 'actions/requestActions';
import {
  LOGIN_REGISTRATION_INPUT_CHANGE,
  REGISTRATION_REQUEST,
  LOG_OUT,
} from 'constants/actionTypes';

describe('authenticated reducer', () => {
  let state;

  it('should return initial state on default action', () => {
    const newState = authenticated(undefined, {});

    expect(newState).toEqual(initialState);

    state = newState;
  });

  it('should update form on input change', () => {
    const form = 'registration';
    const field = 'name';
    const value = 'john';

    const actionObj = inputChange(LOGIN_REGISTRATION_INPUT_CHANGE, form, field, value);

    const newState = authenticated(state, actionObj);

    expect(newState[form][field]).toBe(value);
    expect(newState[form].mail).toBe(initialState[form].mail);
    expect(newState[form].password).toBe(initialState[form].password);
    expect(newState.login).toEqual(initialState.login);
    expect(newState.token).toBe(initialState.token);

    state = newState;
  });

  it('should reset forms on request success', () => {
    const token = 'token';

    const actionObj = requestSucceeded(REGISTRATION_REQUEST, { token });

    const newState = authenticated(state, actionObj);

    expect(newState.registration).toEqual(initialState.registration);
    expect(newState.login).toEqual(initialState.login);
    expect(newState.token).toBe(token);

    state = newState;
  });

  it('should reset token on log out', () => {
    const newState = authenticated(state, action(LOG_OUT));

    expect(newState.token).toBe(initialState.token);

    state = newState;
  });
});
