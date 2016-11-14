import React from 'react';

import Header from './Header.jsx';
import RegistrationForm from './RegistrationForm.jsx';
import LoginForm from './LoginForm.jsx';
import Modal from './Modal.jsx';

function LoginRegistration(props) {
  return (
    <div>
      <Header
        hasLogOutBtn={false}
      />

      <RegistrationForm
        form="registration"
        {...props.authenticated.registration}
        triggerId={props.requests.triggerId}
        isDisabled={props.requests.isFetching}
        inputChangeHandler={props.inputChangeHandler}
        submitHandler={props.registrationSubmitHandler}
      />

      <LoginForm
        form="login"
        {...props.authenticated.login}
        triggerId={props.requests.triggerId}
        isDisabled={props.requests.isFetching}
        inputChangeHandler={props.inputChangeHandler}
        submitHandler={props.loginSubmitHandler}
      />

      <Modal
        {...props.requests.modal}
        clickHandler={props.modalBtnHandler}
      />
    </div>
  );
}

export default LoginRegistration;
