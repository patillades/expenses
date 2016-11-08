import React from 'react';

import Input from './Input.jsx';
import Button from './Button.jsx';

function LoginForm(props) {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">Sign in if you already have an account</div>

      <div className="panel-body">
        <form>
          <fieldset disabled={props.isDisabled}>
            <Input
              id="login_mail"
              label="Email address"
              type="email"
              placeholder="Email"
              changeHandler={props.inputChangeHandler}
            />

            <Input
              id="login_password"
              label="Password"
              type="password"
              placeholder="Password"
              changeHandler={props.inputChangeHandler}
            />

            <Button txt="Sign in" />
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
