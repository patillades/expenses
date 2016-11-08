import connect from 'react-redux/lib/components/connect';

import {
  inputChange,
  registrationRequest,
  registerUser,
  modalBtnClick
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

    registerSubmitHandler: () => {
      dispatch(registrationRequest());
      dispatch(registerUser());
    },

    modalBtnHandler: () => dispatch(modalBtnClick()),
  };
}

const LoginRegisterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRegister);

export default LoginRegisterContainer;
