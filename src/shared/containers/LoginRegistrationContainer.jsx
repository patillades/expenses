import connect from 'react-redux/lib/components/connect';

import {
  inputChange,
  initRequest,
  sendRequest,
  modalBtnClick
} from 'actions/actions';
import {
  REGISTRATION_REQUEST,
  LOGIN_REQUEST
} from 'constants/actionTypes';

import LoginRegistration from 'components/LoginRegistration.jsx';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    inputChangeHandler: e => dispatch(inputChange(
      e.target.id,
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
