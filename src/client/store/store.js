import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import merge from 'lodash/merge';

import authenticated, { initialState as initialAuthenticatedState } from 'reducers/authenticated';
import expenses from 'reducers/expenses';
import requests from 'reducers/requests';
import filters from 'reducers/filters';
import expensesView from 'reducers/expensesView';
import modals from 'reducers/modals';
import expenseCategories from 'reducers/expenseCategories';

// @todo remove code on production
let composeEnhancers = compose;

// check window so mocha tests work
if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

// keys to be persisted on localStorage and used as preloaded state for redux's store
const authKeysToStore = ['id', 'token'];

const store = createStore(
  combineReducers({
    authenticated,
    expenses,
    requests,
    filters,
    expensesView,
    modals,
    expenseCategories,
  }),
  {
    authenticated: merge({}, initialAuthenticatedState, authKeysToStore.reduce(
      (obj, key) => Object.assign({}, obj, { [key]: localStorage.getItem(key) }),
      {}
    )),
  },
  composeEnhancers(applyMiddleware(thunk))
);

/**
 * Persist a piece of the application state (state[reducer][varName]) to localStorage
 *
 * @param {Store} appStore
 * @param {string} reducer
 * @param {string} varName
 * @return {boolean}
 */
function shouldUpdateLocalStorage(appStore, reducer, varName) {
  const value = appStore.getState()[reducer][varName];

  if (localStorage.getItem(varName) === value) {
    return false;
  }

  if (!value) {
    localStorage.removeItem(varName);
  } else {
    localStorage.setItem(varName, value);
  }

  return true;
}

const shouldUpdateAuth = varName => shouldUpdateLocalStorage(store, 'authenticated', varName);

authKeysToStore.forEach(key => store.subscribe(() => shouldUpdateAuth(key)));

export { shouldUpdateLocalStorage };
export default store;
