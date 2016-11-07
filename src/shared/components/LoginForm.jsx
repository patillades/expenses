import React from 'react';

import Input from './Input.jsx';
import Button from './Button.jsx';

function LoginForm() {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">Sign in if you already have an account</div>

      <div className="panel-body">
        <form>
          <Input
            id="login_mail"
            label="Email address"
            type="email"
            placeholder="Email"
          />

          <Input
            id="login_password"
            label="Password"
            type="password"
            placeholder="Password"
          />

          <Button txt="Sign in" />
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
