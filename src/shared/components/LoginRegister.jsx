import React from 'react';

import Header from 'components/Header.jsx';
import RegisterForm from 'components/RegisterForm.jsx';
import LoginForm from 'components/LoginForm.jsx';
import Modal from 'components/Modal.jsx';

function LoginRegister(props) {
  return (
    <div>
      <Header />

      <RegisterForm
        inputChangeHandler={props.inputChangeHandler}
        registerBtnHandler={props.registerBtnHandler}
      />

      <LoginForm
        inputChangeHandler={props.inputChangeHandler}
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
