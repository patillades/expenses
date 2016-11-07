import React from 'react';

import Header from 'components/Header.jsx';
import RegisterForm from 'components/RegisterForm.jsx';
import LoginForm from 'components/LoginForm.jsx';

function LoginRegister(props) {
  return (
    <div>
      <Header />

      <RegisterForm {...props} />

      <LoginForm {...props} />
    </div>
  );
}

export default LoginRegister;
