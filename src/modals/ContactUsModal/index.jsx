import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../components/Modal";
import { setUser } from "../../store/slices/authSlice";
import clsx from "clsx";
import useModal from "../../hooks/useModal";
import OtpModal from "../otp";
import contactUsImage from "../../assets/contactUs.png";

const ContactUsModal = ({ ...rest }) => {
  const [isMember, setIsMember] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  //   const otpUtils = useModal(false);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //auth/forgot-password
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post("mail/contactus", { name, email, message })
      .then((res) => {
        if (res.status === 202) {
          // dispatch(setUser({ token: res.data.token, ...res.data.user }));
          // rest.toggleShow();
          toast.error("Error in submitting form");
          // otpUtils.toggleShow();
        }
        if (res.status === 200) {
          // dispatch(setUser({ token: res.data.token, ...res.data.user }));
          toast.success("Form has been submitted");
          //   otpUtils.toggleShow();
          rest.toggleShow();
        }
      })

      .catch((err) => {
        console.log(err, "error incoming");

        if (err?.response?.data?.errors) {
          toast.error(err?.response?.data?.errors[0]);
          // otpUtils.toggleShow();
          //   rest.toggleShow()
        } else {
          toast.error("Uh Oh! Something went wrong");
          // otpUtils.toggleShow();
          //   rest.toggleShow()
        }
      })
      .finally(() => [setIsLoading(false)]);
  };

  return (
    <Modal
      id="contact-modal"
      title="Contact Us"
      {...rest}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "blue",
      }}
    >
      <div className="text-center">
        <form>
          <div className="form-controll">
            <h1 style={{ fontWeight: "400" }}>
              HAVE ANY QUESTIONS OR SUGGESTIONS? FEEL FREE TO REACH OUT
            </h1>
            <div className="content">
              We're here to help! If you have any questions or concerns, please don't hesitate
              to get in touch with us. You can reach us by email or by filling out the contact
              form below. We strive to respond to all inquiries as quickly as possible.
            </div>
            <div>
              <strong className="mail-strong">Email: fracturedfrazez@gmail.com</strong>
            </div>
            <div className="content">
              <div className="left">
                <img src={contactUsImage} />
              </div>
              <div className="right">
                <div className="inputfields">
                  <input
                    placeholder="Full Name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  ></input>
                  <input
                    placeholder="Email Address"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="messagebox">
                  <textarea
                    placeholder="Message or Suggestion"
                    rows="15"
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  ></textarea>
                  <button
                    style={{
                      width: "100%",
                      background: "#6DCEFF",
                      borderRadius: "15px",
                      color: "white",
                      fontWeight: "bold",
                      padding: "10px",
                      border: "1px solid #6DCEFF",
                    }}
                    onClick={formSubmitHandler}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ContactUsModal;
