import React from 'react';

import Input from './Input.jsx';
import Button from './Button.jsx';

function RegisterForm(props) {
  return (
    <div className="panel panel-primary">
      <div className="panel-heading">Sign up with your email address</div>

      <div className="panel-body">
        <form>
          <fieldset disabled={props.isDisabled}>
            <Input
              id="register_name"
              label="Your name"
              type="text"
              placeholder="Name"
              isRequired
              changeHandler={props.inputChangeHandler}
            />

            <Input
              id="register_mail"
              label="Email address"
              type="email"
              placeholder="Email"
              isRequired
              changeHandler={props.inputChangeHandler}
            />

            <Input
              id="register_password"
              label="Password"
              type="password"
              placeholder="Password"
              isRequired
              changeHandler={props.inputChangeHandler}
            />

            <Button
              txt="Sign up"
              isLoading={props.isDisabled}
              clickHandler={props.submitHandler}
            />
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
