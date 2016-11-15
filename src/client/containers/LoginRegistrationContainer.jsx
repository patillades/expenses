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

    // prevent default so the form submission doesn't force a page reload
    registrationSubmitHandler: (e) => {
      e.preventDefault();

      dispatch(sendRequest(
        REGISTRATION_REQUEST,
        { triggerId: e.target.id }
      ));
    },

    // prevent default so the form submission doesn't force a page reload
    loginSubmitHandler: (e) => {
      e.preventDefault();

      dispatch(sendRequest(
        LOGIN_REQUEST,
        { triggerId: e.target.id }
      ));
    },

    modalBtnHandler: () => dispatch(modalBtnClick()),
  };
}

const LoginRegistrationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRegistration);

export default LoginRegistrationContainer;
