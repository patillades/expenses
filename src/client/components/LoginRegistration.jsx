import React, { PropTypes } from 'react';

import Header from './Header.jsx';
import RegistrationForm from './RegistrationForm.jsx';
import LoginForm from './LoginForm.jsx';
import Modal from './Modal.jsx';

const propTypes = {
  authenticated: PropTypes.shape({
    token: PropTypes.string,
    registration: PropTypes.shape({
      name: PropTypes.string.isRequired,
      mail: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    }).isRequired,
    login: PropTypes.shape({
      mail: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  requests: PropTypes.shape({
    triggerId: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
  }).isRequired,
  modals: PropTypes.shape({
    inputModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      msg: PropTypes.string.isRequired,
    }).isRequired,
    msgModal: PropTypes.shape({
      isOpen: PropTypes.bool.isRequired,
      txt: PropTypes.string,
    }).isRequired,
  }).isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  registrationSubmitHandler: PropTypes.func.isRequired,
  loginSubmitHandler: PropTypes.func.isRequired,
  modalBtnHandler: PropTypes.func.isRequired,
};

function LoginRegistration(props) {
  return (
    <div>
      <Header
        hasLogOutBtn={false}
      />

      <div className="row">
        <div className="col-xs-4 col-xs-offset-1">
          <RegistrationForm
            form="registration"
            {...props.authenticated.registration}
            triggerId={props.requests.triggerId}
            isDisabled={props.requests.isFetching}
            inputChangeHandler={props.inputChangeHandler}
            submitHandler={props.registrationSubmitHandler}
          />
        </div>

        <div className="col-xs-2" />

        <div className="col-xs-4">
          <LoginForm
            form="login"
            {...props.authenticated.login}
            triggerId={props.requests.triggerId}
            isDisabled={props.requests.isFetching}
            inputChangeHandler={props.inputChangeHandler}
            submitHandler={props.loginSubmitHandler}
          />
        </div>

      </div>

      <Modal
        {...props.modals.msgModal}
        clickHandler={props.modalBtnHandler}
      />
    </div>
  );
}

LoginRegistration.propTypes = propTypes;

export default LoginRegistration;
