import React from 'react';
import ReactModal from 'react-modal';

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

function Modal(props) {
  return (
    <ReactModal
      isOpen={props.isOpen}
      style={style}
      contentLabel="Modal"
    >
      <h2 className="text-center">{props.msg}</h2>

      <button
        className="btn btn-success center-block"
        onClick={props.clickHandler}
      >
        Ok
      </button>
    </ReactModal>
  );
}

export default Modal;
