import Link from "next/link";
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
          To buy this NFT, you have to login first. It is necessary to have
          added the wallet to Metamask.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Link href={"/signup"}>
          <button
            className="btn btn-outline-primary btn-lg"
            // onClick={props.onHide}
          >
            Continue
          </button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPopup;
