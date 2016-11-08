import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import authenticated, { initialState as initialAuthenticatedState } from 'reducers/authenticated';

// get stored id and token and use it as preloaded state for the store
const authState = {
  id: localStorage.getItem('id'),
  token: localStorage.getItem('token'),
};

const store = createStore(
  combineReducers({
    authenticated,
  }),
  { authenticated: Object.assign({}, initialAuthenticatedState, authState) },
  applyMiddleware(thunk)
);

/**
 * Persist auth state to localStorage if it has changed
 *
 * @param {string} key
 * @param {string} newVal
 * @returns {boolean}
 */
function updateAuthStateIfNeeded(key, newVal) {
  if (authState[key] === newVal) {
    return false;
  }

  authState[key] = newVal;

  localStorage.setItem(key, newVal);

  return true;
}

store.subscribe(() => {
  const { id, token } = store.getState().authenticated;
  const authData = { id, token };

  Object.keys(authData).forEach(key => updateAuthStateIfNeeded(key, authData[key]));
});

export default store;
