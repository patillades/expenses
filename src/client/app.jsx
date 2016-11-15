import React from 'react';
import { render } from 'react-dom';
import Provider from 'react-redux/lib/components/Provider';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import Route from 'react-router/lib/Route';

import store from 'store/store';
import LoginRegistrationContainer from 'containers/LoginRegistrationContainer.jsx';
import UserExpensesContainer from 'containers/UserExpensesContainer.jsx';

/**
 * Send users to login page if they are not authenticated
 *
 * @param {Location} location
 */
function sendToLoginIfNoToken(location) {
  const { token } = store.getState().authenticated;

  if (location.pathname !== '/login' && !token) {
    browserHistory.push('/login');
  }
}

// check for authentication when the app is loaded
sendToLoginIfNoToken(browserHistory.getCurrentLocation());

// check for authentication whenever the user navigates
browserHistory.listen(sendToLoginIfNoToken);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={UserExpensesContainer} />
      <Route path="/login" component={LoginRegistrationContainer} />
    </Router>
  </Provider>,
  document.getElementById('js-app')
);
