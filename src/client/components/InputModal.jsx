import React, { PropTypes } from 'react';
import ReactModal from 'react-modal';

import Input from './Input.jsx';

const style = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '10px 50px 20px 50px',
  },
};

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  msg: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
};

function InputModal(props) {
  return (
    <ReactModal
      isOpen={props.isOpen}
      style={style}
      contentLabel="Modal"
      onRequestClose={props.clickHandler}
    >
      <h2 className="text-center">{props.msg}</h2>

      <Input
        type="text"
        isRequired
        changeHandler={props.inputChangeHandler}
        value={props.inputValue}
        form="modal"
        field="input"
      />

      <button
        id="inputModalBtn"
        className="btn btn-success center-block"
        onClick={props.clickHandler}
      >
        Ok
      </button>
    </ReactModal>
  );
}

InputModal.propTypes = propTypes;

export default InputModal;
