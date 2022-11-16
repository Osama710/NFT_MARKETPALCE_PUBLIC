import React from "react";
import { Modal } from "react-bootstrap";

const ModalPopup = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          it is necessary to have added the wallet to Metamask, it needs access
          to polygon network and that the gas fee should be set to maximum
        </p>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-outline-primary btn-lg"
          onClick={props.onHide}
        >
          Continue
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPopup;
