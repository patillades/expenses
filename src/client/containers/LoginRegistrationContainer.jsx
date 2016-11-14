import connect from 'react-redux/lib/components/connect';

import {
  inputChange,
  sendRequest,
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

    registrationSubmitHandler: e => dispatch(sendRequest(
      REGISTRATION_REQUEST,
      { triggerId: e.target.id }
    )),

    loginSubmitHandler: e => dispatch(sendRequest(
      LOGIN_REQUEST,
      { triggerId: e.target.id }
    )),

    modalBtnHandler: () => dispatch(modalBtnClick()),
  };
}

const LoginRegistrationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRegistration);

export default LoginRegistrationContainer;
