import connect from 'react-redux/lib/components/connect';

import { inputChange } from 'actions/actions';

import LoginRegister from 'components/LoginRegister.jsx';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    inputChangeHandler: function (e) {
      dispatch(inputChange(
        e.target.id,
        e.target.value
      ));
    },
  };
}

const LoginRegisterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRegister);

export default LoginRegisterContainer;
