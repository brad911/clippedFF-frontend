import React from "react";
import logo from "../../assets/newlogo.png";
import Modal from "../../components/Modal";

const SeeYouSoonModal = ({ ...rest }) => {
  return (
    <Modal id="tommorrow-modal" {...rest} title="See You Soon">
      <div className="text-center">
        <img className="bye" src="/assets/gifs/bye.gif" alt="bye" />
        <h2 className="my-4">That’s all for today! Please come back tomorrow for more.</h2>
        <img src={logo}></img>
      </div>
    </Modal>
  );
};

export default SeeYouSoonModal;
