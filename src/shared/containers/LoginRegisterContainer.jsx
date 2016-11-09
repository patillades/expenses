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

import LoginRegister from 'components/LoginRegister.jsx';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    inputChangeHandler: e => dispatch(inputChange(
      e.target.id,
      e.target.value
    )),

    registerSubmitHandler: () => {
      dispatch(initRequest(REGISTRATION_REQUEST));
      dispatch(sendRequest('register'));
    },

    loginSubmitHandler: () => {
      dispatch(initRequest(LOGIN_REQUEST));
      dispatch(sendRequest('login'));
    },

    modalBtnHandler: () => dispatch(modalBtnClick()),
  };
}

const LoginRegisterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRegister);

export default LoginRegisterContainer;
