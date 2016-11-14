import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import authenticated, { initialState as initialAuthenticatedState } from 'reducers/authenticated';
import expenses from 'reducers/expenses';
import requests from 'reducers/requests';
import filters from 'reducers/filters';
import expensesView from 'reducers/expensesView';

// get stored token and use it as preloaded state for the store
let storedToken = localStorage.getItem('token');

const store = createStore(
  combineReducers({
    authenticated,
    expenses,
    requests,
    filters,
    expensesView,
  }),
  { authenticated: Object.assign({}, initialAuthenticatedState, { token: storedToken }) },
  applyMiddleware(thunk)
);

/**
 * Persist auth state to localStorage if it has changed
 *
 * @param {object} authState
 * @returns {boolean}
 */
function shouldUpdateStoredToken(authState) {
  const { token } = authState;

  if (storedToken === token) {
    return false;
  }

  storedToken = token;

  if (!token) {
    localStorage.removeItem('token');
  } else {
    localStorage.setItem('token', token);
  }

  return true;
}

store.subscribe(() => shouldUpdateStoredToken(store.getState().authenticated));

export default store;
