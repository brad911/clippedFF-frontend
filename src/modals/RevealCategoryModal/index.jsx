import React from "react";

import Modal from "../../components/Modal";

const RevealCategoryModal = ({ onCancel, onConfirm, ...rest }) => {
  return (
    <Modal id="reveal-modal" {...rest} title="Are you sure?">
      <div className="text-center">
        <img className="bye" src="/assets/gifs/info.gif" alt="info" />
        <h2 className="my-4">
          Revealing category costs a hint,{" "}
          <span className="text-primary-1">
            you will not be eligible for a gold medal
          </span>
          !
        </h2>

        <div className="buttons">
          <button onClick={onCancel}>Don't reveal yet</button>
          <button
            onClick={() => {
              onCancel();
              onConfirm();
            }}
          >
            Yes, I understand
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RevealCategoryModal;
