import React from 'react';

import Header from './Header.jsx';
import RegistrationForm from './RegistrationForm.jsx';
import LoginForm from './LoginForm.jsx';
import Modal from './Modal.jsx';

function LoginRegistration(props) {
  return (
    <div>
      <Header />

      <RegistrationForm
        form="registration"
        {...props.authenticated.registration}
        triggerId={props.authenticated.triggerId}
        isDisabled={props.authenticated.isFetching}
        inputChangeHandler={props.inputChangeHandler}
        submitHandler={props.registrationSubmitHandler}
      />

      <LoginForm
        form="login"
        {...props.authenticated.login}
        triggerId={props.authenticated.triggerId}
        isDisabled={props.authenticated.isFetching}
        inputChangeHandler={props.inputChangeHandler}
        submitHandler={props.loginSubmitHandler}
      />

      <Modal
        {...props.authenticated.modal}
        clickHandler={props.modalBtnHandler}
      />
    </div>
  );
}

export default LoginRegistration;
