import React, { useEffect } from "react";
import $ from "jquery";
import clsx from "clsx";

const Modal = ({
  noOverlay,
  show,
  toggleShow,
  className,
  children,
  onClose,
  title,
  setMeta,
  customCloser,
  ...rest
}) => {
  const closeHandler = () => {
    if (onClose) {
      onClose();
    }

    toggleShow();
  };

  useEffect(() => {
    const activeModalsNum = $(".custom-modal.show").length;

    if (activeModalsNum) {
      $("body").css("overflow", "hidden");
    } else {
      $("body").css("overflow", "auto");
    }
  }, [show]);

  return (
    <>
      {!noOverlay && (
        <div
          className={clsx("modal-overlay", { show })}
          onClick={closeHandler}
        />
      )}
      <div className={clsx("custom-modal-wrap", className, { show })} {...rest}>
        <div className={clsx("custom-modal")}>
          <div className="modal-head">
            <div className="modal-head__title" style={{color: title === "Game Rules" || "Contact Us"? "#0E4269" : "black"}}>{title}</div>  
            <div className="close" onClick={closeHandler}>
              &times;
            </div>
          </div>
          <div className="modal-body">{children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
