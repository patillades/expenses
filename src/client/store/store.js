import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import authenticated, { initialState as initialAuthenticatedState } from 'reducers/authenticated';
import expenses from 'reducers/expenses';
import requests from 'reducers/requests';
import filters from 'reducers/filters';
import expensesView from 'reducers/expensesView';
import modals from 'reducers/modals';

// get stored token and use it as preloaded state for the store
let storedToken = localStorage.getItem('token');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    authenticated,
    expenses,
    requests,
    filters,
    expensesView,
    modals,
  }),
  { authenticated: Object.assign({}, initialAuthenticatedState, { token: storedToken }) },
  composeEnhancers(applyMiddleware(thunk))
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
