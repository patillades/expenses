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
              isRequired
              changeHandler={props.inputChangeHandler}
              value={props.mail}
            />

            <Input
              id="login_password"
              label="Password"
              type="password"
              placeholder="Password"
              isRequired
              changeHandler={props.inputChangeHandler}
              value={props.password}
            />

            <Button
              id="loginBtn"
              triggerId={props.triggerId}
              txt="Sign in"
              isLoading={props.isDisabled}
              clickHandler={props.submitHandler}
            />
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
