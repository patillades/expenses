import { createStore, combineReducers } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import Provider from 'react-redux/lib/components/Provider';
import Router from 'react-router/lib/Router';
import hashHistory from 'react-router/lib/hashHistory';
import Route from 'react-router/lib/Route';

import LoginRegisterContainer from 'containers/LoginRegisterContainer.jsx';

import authenticated from 'reducers/authenticated';

const store = createStore(
  combineReducers({
    authenticated,
  })
);

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={LoginRegisterContainer} />
    </Router>
  </Provider>,
  document.getElementById('js-app')
);
