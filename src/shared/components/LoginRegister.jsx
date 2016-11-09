import React from 'react';

import Header from './Header.jsx';
import RegisterForm from './RegisterForm.jsx';
import LoginForm from './LoginForm.jsx';
import Modal from './Modal.jsx';

function LoginRegister(props) {
  return (
    <div>
      <Header />

      <RegisterForm
        isDisabled={props.authenticated.isFetching}
        inputChangeHandler={props.inputChangeHandler}
        submitHandler={props.registerSubmitHandler}
      />

      <LoginForm
        isDisabled={props.authenticated.isFetching}
        inputChangeHandler={props.inputChangeHandler}
        submitHandler={props.loginSubmitHandler}
      />

      <Modal
        isOpen={props.authenticated.modal.isOpen}
        msg={props.authenticated.modal.msg}
        clickHandler={props.modalBtnHandler}
      />
    </div>
  );
}

export default LoginRegister;
