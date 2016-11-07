import React from 'react';

import Input from './Input.jsx';

function LoginForm() {
  return (
    <form>
      <Input
        id="mail"
        label="Email address"
        type="email"
        placeholder="Email"
      />

      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Password"
      />
    </form>
  );
}

export default LoginForm;
