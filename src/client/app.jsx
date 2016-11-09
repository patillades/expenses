import React from 'react';
import { render } from 'react-dom';
import Provider from 'react-redux/lib/components/Provider';
import Router from 'react-router/lib/Router';
import hashHistory from 'react-router/lib/hashHistory';
import Route from 'react-router/lib/Route';

import store from 'store';
import LoginRegisterContainer from 'containers/LoginRegisterContainer.jsx';
import UserExpensesContainer from 'containers/UserExpensesContainer.jsx';

hashHistory.listen(location => {
  const { token } = store.getState().authenticated;

  // send users to login page if they are not authenticated
  if (location.pathname !== '/login' && !token) {
    hashHistory.push('/login');
  }
});

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={UserExpensesContainer} />
      <Route path="/login" component={LoginRegisterContainer} />
    </Router>
  </Provider>,
  document.getElementById('js-app')
);
