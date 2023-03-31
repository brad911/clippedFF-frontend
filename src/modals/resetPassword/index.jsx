import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../components/Modal";
import { setUser } from "../../store/slices/authSlice";
import clsx from "clsx";
import useModal from "../../hooks/useModal";

const ResetPasswordModal = ({ ...rest }) => {
  const [isMember, setIsMember] = useState(false);

  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  //auth/forgot-password
  const dispatch = useDispatch();
  const inputChangeHandler = (e) => setPassword(e.target.value);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .patch(
        "/users/updatePassword",
        { password },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("TempToken"),
          },
        }
      )
      .then((res) => {
        if (res.status === 202) {
          toast.error("");
        }
        if (res.status === 200) {
          if (password === repassword) {
            dispatch(setUser({ token: localStorage.getItem("TempToken"), ...res.data }));
            rest.toggleShow();
            rest.otpModalUtils.toggleShow(false);
            rest.forgetPasswordUtils.toggleShow(false);
            rest.loginUtils.toggleShow(false);
            // console.log(res);
            localStorage.getItem("TempToken");
            toast.success("Password successfully changed");
          } else {
            toast.error("Both passwords do not match");
          }
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data);
        // console.log(err);
        if (err?.response?.data?.errors) {
          toast.error(err?.response?.data?.errors[0]);
        } else {
          toast.error(err.resonse.data);
        }
      })
      .finally(() => [setIsLoading(false)]);
  };

  useEffect(() => {
    rest.otpModalUtils.toggleShow();
    rest.forgetPasswordUtils.toggleShow();
  }, []);

  return (
    <Modal
      id="resetpassword-modal"
      // className={clsx(token && ="logged-in")}
      title="Reset Password"
      {...rest}
    >
      <div className="text-center">
        <form onSubmit={formSubmitHandler}>
          <div className="form-control">
            <label htmlFor="otp" onClick={() => {}}>
              Password
            </label>
            <input
              type="password"
              name="otp"
              id="otp"
              value={password}
              onChange={inputChangeHandler}
            />
          </div>
          <div className="form-control">
            <label
              htmlFor="otp"
              onClick={() => {
                // console.log(password, "password");
              }}
            >
              Retype Password
            </label>
            <input
              type="password"
              name="secondpass"
              id="secondpass"
              value={repassword}
              onChange={(e) => {
                setRepassword(e.target.value);
              }}
            />
          </div>
          {/* <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formState.password}
              onChange={inputChangeHandler}
            />
          </div> */}

          <button className="submit btn" disabled={isLoading}>
            Submit
          </button>
          {/* 
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
          </div> */}
        </form>

        {/* <div className="or">OR</div> */}
        {/* 
        <form action="">
          <GoogleLogin
            buttonText={isLoading ? "Loading..." : "Login with google"}
            onSuccess={googleLoginSuccess}
            onFailure={googleLoginFailure}
          /> */}
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
        {/* </form> */}
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
