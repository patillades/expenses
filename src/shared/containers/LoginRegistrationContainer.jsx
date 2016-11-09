import connect from 'react-redux/lib/components/connect';

import {
  inputChange,
  initRequest,
  sendRequest,
  modalBtnClick
} from 'actions/actions';
import {
  REGISTRATION,
  REGISTRATION_REQUEST,
  LOGIN,
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

    registrationSubmitHandler: () => {
      dispatch(initRequest(REGISTRATION_REQUEST));
      dispatch(sendRequest(REGISTRATION));
    },

    loginSubmitHandler: () => {
      dispatch(initRequest(LOGIN_REQUEST));
      dispatch(sendRequest(LOGIN));
    },

    modalBtnHandler: () => dispatch(modalBtnClick()),
  };
}

const LoginRegistrationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRegistration);

export default LoginRegistrationContainer;
