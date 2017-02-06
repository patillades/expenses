import connect from 'react-redux/lib/components/connect';

import {
  inputChange,
  submitForm,
  modalBtnClick,
} from 'actions/actions';
import {
  LOGIN_REGISTRATION_INPUT_CHANGE,
  REGISTRATION_REQUEST,
  LOGIN_REQUEST,
} from 'constants/actionTypes';

import LoginRegistration from 'components/LoginRegistration.jsx';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    inputChangeHandler: e => dispatch(inputChange(
      LOGIN_REGISTRATION_INPUT_CHANGE,
      e.target.dataset.form,
      e.target.dataset.field,
      e.target.value
    )),

    registrationSubmitHandler: e => dispatch(submitForm(e, REGISTRATION_REQUEST)),

    loginSubmitHandler: e => dispatch(submitForm(e, LOGIN_REQUEST)),

    modalBtnHandler: () => dispatch(modalBtnClick()),
  };
}

const LoginRegistrationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRegistration);

export default LoginRegistrationContainer;
