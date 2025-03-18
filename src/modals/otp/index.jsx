import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";

import Modal from "../../components/Modal";
import useModal from "../../hooks/useModal";

const OtpModal = ({ ...rest }) => {
  const [isMember, setIsMember] = useState(false);
  // const [formState, setFormState] = useState({

  //   email: "",
  // });
  const resetPasswordUtils = useModal(false);

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //auth/forgot-password

  const inputChangeHandler = (e) => setOtp(e.target.value);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post("/auth/checkOTP", { code: otp })
      .then((res) => {
        if (res.status === 202) {
          // console.log("wrong otp");
          toast.error("Wrong OTP", { autoClose: 2000 });
        }
        if (res.status === 200) {
          // console.log("wrong otp");
          toast.success("OTP Verified, change your password now.", { autoClose: 2000 });
          rest.resetPasswordModalUtils.toggleShow();
          // console.log(token)
          // dispatch(setUser({ token: res.data.token, ...res.data.user }));
          // setState(token:res.data.token)
          rest.toggleShow();
          localStorage.setItem("TempToken", res.data.token);
          // rest.toggleShow(false)
        }
        // rest.toggleShow();

        // console.log(res, "otp res")
      })
      .catch((err) => {
        // console.log(err);
        if (err?.response?.data?.errors) {
          toast.error(err?.response?.data?.errors[0], { autoClose: 2000 });
        } else {
          toast.error("Uh Oh! Something went wrong", { autoClose: 2000 });
        }
      })
      .finally(() => [setIsLoading(false)]);
  };

  return (
    <Modal
      id="otp-modal"
      // className={clsx(token && ="logged-in")}
      title="OTP"
      {...rest}
    >
      <div className="text-center">
        <form onSubmit={formSubmitHandler}>
          <div className="form-control">
            <label
              htmlFor="otp"
              // onClick={()=>{console.log(otp, "otp")}}
            >
              OTP
            </label>
            <input type="text" name="otp" id="otp" value={otp} onChange={inputChangeHandler} />
          </div>
         

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

export default OtpModal;
