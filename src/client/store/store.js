import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';
import merge from 'lodash/merge';

import authenticated, { initialState as initialAuthenticatedState } from 'reducers/authenticated';
import expenses from 'reducers/expenses';
import requests from 'reducers/requests';
import filters from 'reducers/filters';
import expensesView from 'reducers/expensesView';
import modals from 'reducers/modals';

// get data on localStorage and use it as preloaded state for redux's store
const storedVars = {
  id: localStorage.getItem('id'),
  token: localStorage.getItem('token'),
};

if (storedVars.token) {
  try {
    jwtDecode(storedVars.token);
  } catch (e) {
    // remove stored data if token is falsy
    storedVars.id = null;
    storedVars.token = null;
    localStorage.removeItem('id');
    localStorage.removeItem('token');
  }
}

// @todo remove code on production
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const { id, token } = storedVars;
const store = createStore(
  combineReducers({
    authenticated,
    expenses,
    requests,
    filters,
    expensesView,
    modals,
  }),
  { authenticated: merge({}, initialAuthenticatedState, { id, token }) },
  composeEnhancers(applyMiddleware(thunk))
);

/**
 * Persist a piece of the application state (state[statePart][stateVarName]) to localStorage
 *
 * @param {string} stateVarName
 * @param {string} statePart
 * @return {boolean}
 */
function shouldUpdateStoredState(stateVarName, statePart) {
  const stateVar = store.getState()[statePart][stateVarName];

  if (storedVars[stateVarName] === stateVar) {
    return false;
  }

  storedVars[stateVarName] = stateVar;

  if (!stateVar) {
    localStorage.removeItem(stateVarName);
  } else {
    localStorage.setItem(stateVarName, stateVar);
  }

  return true;
}

store.subscribe(() => shouldUpdateStoredState('id', 'authenticated'));
store.subscribe(() => shouldUpdateStoredState('token', 'authenticated'));

export default store;
