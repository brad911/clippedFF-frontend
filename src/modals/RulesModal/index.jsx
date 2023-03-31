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

const RulesModal = ({ ...rest }) => {
  const [isMember, setIsMember] = useState(false);
  // const [formState, setFormState] = useState({

  //   email: "",
  // });
  const otpUtils = useModal(false);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //auth/forgot-password
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const toggleForm = (e) => {
    e.preventDefault();
    setIsMember((prevState) => !prevState);
  };

  const inputChangeHandler = (e) => setEmail(e.target.value);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post("/auth/forgot-password", { email })
      .then((res) => {
        if (res.status === 202) {
          // dispatch(setUser({ token: res.data.token, ...res.data.user }));
          // rest.toggleShow();
          toast.error("No user Found");
          // otpUtils.toggleShow();
        }
        if (res.status === 200) {
          // dispatch(setUser({ token: res.data.token, ...res.data.user }));
          toast.success("Check your email for OTP");
          otpUtils.toggleShow();
          rest.show(false);
        }
      })

      .catch((err) => {
        console.log(err, "error incoming");

        if (err?.response?.data?.errors) {
          toast.error(err?.response?.data?.errors[0]);
          // otpUtils.toggleShow();
        } else {
          toast.error("Uh Oh! Something went wrong");
          // otpUtils.toggleShow();
        }
      })
      .finally(() => [setIsLoading(false)]);
  };

  const googleLoginSuccess = (response) => {
    // console.log(response);
    setIsLoading(true);

    // axios
    //   .post("///auth/forgot-password", { credential: response.credential })
    //   .then((res) => {
    //     dispatch(setUser({ token: res.data.token, ...res.data.user }));
    //     rest.toggleShow();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     toast.error("Uh Oh! Something went wrong");
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  const googleLoginFailure = (err) => {
    toast.error("Uh Oh! Something went wrong");
    console.log(err);
    setIsLoading(false);
  };

  const facebookSuccess = (response) => {
    // console.log(response);
    setIsLoading(true);

    axios
      .post("/auth/facebook-login", {
        accessToken: response.accessToken,
        userID: response.userID,
      })
      .then((res) => {
        dispatch(setUser({ token: res.data.token, ...res.data.user }));
        rest.toggleShow();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh Oh! Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const facebookFailure = (err) => {
    console.log(err);
    toast.error("Uh Oh! Something went wrong");
    setIsLoading(false);
  };

  return (
    <Modal
      id="rules-modal"
      // className={clsx(token && ="logged-in")}
      title="How to Play the Game"
      {...rest}
    >
      <OtpModal {...otpUtils} />

      <div className="text-center">
        <div className="form-controll">
          <div className="content">
            <p>
              <strong>FracturedFrazez</strong> is a free online word game. We invite players to
              our website to play 3 games every day. There will be a phrase with a category
              next to it. This will be the key to solving the answer. Using the keyboard on
              their mobile or computer, players click on letters to come up with the correct
              answer. If you need it, the computer will give you three hints for each game in
              the form of a dropdown letter. If the same letter appears multiple times, it must
              be clicked on individually. You may also guess but each incorrect guess counts as
              a hint. Solve the fracturedfraz without any help from the computer, and you have
              earned bragging rights.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RulesModal;
