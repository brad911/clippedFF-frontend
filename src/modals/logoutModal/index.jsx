import React, { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../components/Modal";
import { removeUser, setUser } from "../../store/slices/authSlice";
import clsx from "clsx";
import ForgetPasswordModal from "../ForgetPasswordModal";
import useModal from "../../hooks/useModal";

const LogoutModal = ({ ...rest }) => {
  // const [isMember, setIsMember] = useState(false);
  // const [formState, setFormState] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  // });
  // const [isLoading, setIsLoading] = useState(false);
  const forgetpasswordUtils = useModal(false);
 
  const dispatch = useDispatch();
  
  // LOGOUT THE USER FROM THE APP

  const logoutHandler = () => {
    dispatch(removeUser());
    rest.toggleShow(false);
  };

  // const toggleForm = (e) => {
  //   e.preventDefault();
  //   setIsMember((prevState) => !prevState);
  // };

  return (
    <Modal
      id="logout-modal"
      // className={clsx(token && ="logged-in")}
      {...rest}
      
      
    >
      <div className="text-center">
        <form>
          <div className="form-controll">
            <h1>Logging you out</h1>
            <div className="content">
              <p>Do you really wish to log out?</p>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-around", paddingTop: "20px" }}
            >
              <button
                className="btn"
                style={{
                  background: "#6DCEFF",
                  color: "white",
                  width: "30%",
                  padding: "10px",
                  borderRadius: "15px",
                }}
                onClick={logoutHandler}
              >
                Yes
              </button>
              <button
                className="btn"
                onClick={(e) => {
                  rest.toggleShow();
                  e.preventDefault()
               
                }}
              >
                Cancel
              </button>
            </div>
          </div>{" "}
        </form>
      </div>
    </Modal>
  );
};

export default LogoutModal;
