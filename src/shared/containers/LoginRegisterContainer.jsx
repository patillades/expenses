import connect from 'react-redux/lib/components/connect';

import {
  inputChange,
  registrationRequest,
  registerUser,
  closeModal
} from 'actions/actions';

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

    registerBtnHandler: () => {
      dispatch(registrationRequest());
      dispatch(registerUser());
    },

    modalBtnHandler: e => dispatch(closeModal()),
  };
}

const LoginRegisterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRegister);

export default LoginRegisterContainer;
