import React from 'react';

import Input from './Input.jsx';
import Button from './Button.jsx';

function RegistrationForm(props) {
  return (
    <div className="panel panel-primary">
      <div className="panel-heading">Sign up with your email address</div>

      <div className="panel-body">
        <form>
          <fieldset disabled={props.isDisabled}>
            <Input
              id="registration_name"
              label="Your name"
              type="text"
              placeholder="Name"
              isRequired
              changeHandler={props.inputChangeHandler}
              value={props.name}
            />

            <Input
              id="registration_mail"
              label="Email address"
              type="email"
              placeholder="Email"
              isRequired
              changeHandler={props.inputChangeHandler}
              value={props.mail}
            />

            <Input
              id="registration_password"
              label="Password"
              type="password"
              placeholder="Password"
              isRequired
              changeHandler={props.inputChangeHandler}
              value={props.password}
            />

            <Button
              id="registrationBtn"
              triggerId={props.triggerId}
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

export default RegistrationForm;
