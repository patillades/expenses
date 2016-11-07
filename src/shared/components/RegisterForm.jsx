import React from 'react';

import Input from './Input.jsx';
import Button from './Button.jsx';

function RegisterForm() {
  return (
    <div className="panel panel-primary">
      <div className="panel-heading">Sign up with your email address</div>

      <div className="panel-body">
        <form>
          <Input
            id="register_name"
            label="Your name"
            type="text"
            placeholder="Name"
          />

          <Input
            id="register_mail"
            label="Email address"
            type="email"
            placeholder="Email"
          />

          <Input
            id="register_password"
            label="Password"
            type="password"
            placeholder="Password"
          />

          <Button txt="Sign up" />
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
