import React, { PropTypes } from 'react';

import Input from './Input.jsx';
import Button from './Button.jsx';

const propTypes = {
  form: PropTypes.string.isRequired,
  mail: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  triggerId: PropTypes.string,
  isDisabled: PropTypes.bool.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
};

function LoginForm(props) {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">Sign in if you already have an account</div>

      <div className="panel-body">
        <form>
          <fieldset disabled={props.isDisabled}>
            <Input
              label="Email address"
              type="email"
              placeholder="Email"
              isRequired
              changeHandler={props.inputChangeHandler}
              value={props.mail}
              form={props.form}
              field="mail"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Password"
              isRequired
              changeHandler={props.inputChangeHandler}
              value={props.password}
              form={props.form}
              field="password"
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

LoginForm.propTypes = propTypes;

export default LoginForm;
