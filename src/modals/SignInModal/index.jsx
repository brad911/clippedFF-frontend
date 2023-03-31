import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../components/Modal";
import { setUser } from "../../store/slices/authSlice";
import clsx from "clsx";
import ForgetPasswordModal from "../ForgetPasswordModal";
import useModal from "../../hooks/useModal";
import OtpModal from "../otp";
import ResetPasswordModal from "../resetPassword";

const SignInModal = ({ ...rest }) => {
  const [isMember, setIsMember] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const otpModalUtils = useModal(false);
  const forgetpasswordUtils = useModal(false);
  const resetPasswordModalUtils = useModal(false);

  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const toggleForm = (e) => {
    e.preventDefault();
    setIsMember((prevState) => !prevState); 
  };

  const inputChangeHandler = (e) =>
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(isMember ? "/auth/login" : "/auth/register", formState)
      .then((res) => {
        res.data.user.token = res.data.token;
        dispatch(setUser(res.data));
        rest.toggleShow();
      })
      .catch((err) => {
        if (err?.response?.data?.errors) {
          toast.error(err?.response?.data?.errors[0], { autoClose: 1000 });
        } else {
          toast.error("Uh Oh! Something went wrong", { autoClose: 1000 });
        }
      })
      .finally(() => [setIsLoading(false)]);
  };

  const googleLoginSuccess = (response) => {
    setIsLoading(true);

    axios
      .post("/auth/google-login", { credential: response.credential })
      .then((res) => {
        dispatch(setUser({ token: res.data.token, ...res.data.user }));
        rest.toggleShow();
      })
      .catch((err) => {
        toast.error("Uh Oh! Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const googleLoginFailure = (err) => {
    toast.error("Uh Oh! Something went wrong");
    // console.log(err);
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
        // console.log(err);
        toast.error("Uh Oh! Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const facebookFailure = (err) => {
    // console.log(err);
    toast.error("Uh Oh! Something went wrong");
    setIsLoading(false);
  };

  return (
    <Modal
      id="signin-modal"
      className={clsx(token && "logged-in")}
      title="Register As a New Player or Login into an Existing Account
      "
      {...rest}
    >
      <ForgetPasswordModal {...forgetpasswordUtils} otpModalUtils={otpModalUtils} />
      <OtpModal
        {...otpModalUtils}
        resetPasswordModalUtils={resetPasswordModalUtils}
        forgetpasswordUtils={forgetpasswordUtils}
      />
      <ResetPasswordModal
        {...resetPasswordModalUtils}
        otpModalUtils={otpModalUtils}
        forgetPasswordUtils={forgetpasswordUtils}
        loginUtils={rest}
      />

      <div className="text-center">
        <form onSubmit={formSubmitHandler}>
          {!isMember && (
            <div className="form-control">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formState.name}
                onChange={inputChangeHandler}
              />
            </div>
          )}
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formState.email}
              onChange={inputChangeHandler}
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formState.password}
              onChange={inputChangeHandler}
            />
          </div>

          <button className="submit btn" disabled={isLoading}>
            Submit
          </button>

          <div className="switch mb-3">
            {isMember ? (
              <>
                Don't have an account?{" "}
                <button className="btn" onClick={toggleForm}>
                  Signup
                </button>
              </>
            ) : (
              <>
                Already a member?{" "}
                <button className="btn" onClick={toggleForm}>
                  Login
                </button>
              </>
            )}
          </div>
        </form>

        <div className="or">OR</div>
        

        <form action="">
          <GoogleLogin
            buttonText={isLoading ? "Loading..." : "Login with google"}
            onSuccess={googleLoginSuccess}
            onFailure={googleLoginFailure}
          />
          {/* <div className="fb-wrapper">
            <FacebookLogin
              appId="1127823614500397"
              autoLoad={false}
              fields="name,email"
              callback={facebookSuccess}
              onFailure={facebookFailure}
              textButton={isLoading ? "Loading..." : "Login with Facebook"}
              icon="fa-facebook"
            />
          </div> */}
        </form>
        <div style={{ paddingTop: "15px" }}>
          <button onClick={forgetpasswordUtils.toggleShow} className="btn">
            Forgot Password?
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SignInModal;
