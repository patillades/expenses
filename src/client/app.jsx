import React from 'react';
import { render } from 'react-dom';

import Header from 'components/Header.jsx';
import RegisterForm from 'components/RegisterForm.jsx';
import LoginForm from 'components/LoginForm.jsx';

render(
  <div>
    <Header />
    <RegisterForm />
    <LoginForm />
  </div>,
  document.getElementById('js-app')
);
