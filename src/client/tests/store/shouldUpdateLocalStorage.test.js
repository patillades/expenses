import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import expect from 'expect';

import authenticated from 'reducers/authenticated';
import { shouldUpdateLocalStorage } from 'store/store';
import { requestSucceeded } from 'actions/requestActions';
import { action } from 'actions/actions';
import {
  REGISTRATION_REQUEST,
  LOG_OUT,
} from 'constants/actionTypes';

/**
 * localStorage is mocked with the mock-local-storage module
 */
describe('shouldUpdateLocalStorage', () => {
  let store;
  const id = '1';

  before(() => {
    store = createStore(
      combineReducers({ authenticated }),
      applyMiddleware(thunk)
    );

    store.subscribe(() => shouldUpdateLocalStorage(store, 'authenticated', 'id'));
  });

  it('should persist an updated state value to local storage', () => {
    expect(localStorage.getItem('id')).toBe(null);

    store.dispatch(requestSucceeded(REGISTRATION_REQUEST, { id }));

    expect(localStorage.getItem('id')).toBe(id);
  });

  it('should clear local storage on log out', () => {
    expect(localStorage.getItem('id')).toBe(id);

    // dispatch a LOG_OUT action instead of calling logOut because then the browserHistory object
    // has to be stubbed
    store.dispatch(action(LOG_OUT));

    expect(localStorage.getItem('id')).toBe(null);
  });
});
