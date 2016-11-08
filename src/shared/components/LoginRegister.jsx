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
        isDisabled={props.authenticated.isFetching}
        inputChangeHandler={props.inputChangeHandler}
        submitHandler={props.registerSubmitHandler}
      />

      <LoginForm
        isDisabled={props.authenticated.isFetching}
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
