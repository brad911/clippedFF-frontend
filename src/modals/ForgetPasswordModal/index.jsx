import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../components/Modal";
import { setUser } from "../../store/slices/authSlice";

const ForgetPasswordModal = (props) => {
  const { ...rest } = props;
  const [isMember, setIsMember] = useState(false);
  // const [formState, setFormState] = useState({

  //   email: "",
  // });

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
          // console.log(res, "response incoming");
          toast.error("No user Found");
          // otpUtils.toggleShow();
        }
        if (res.status === 200) {
          // dispatch(setUser({ token: res.data.token, ...res.data.user }));
          // console.log(res, "response incoming");
          toast.success(
            "Check your email for OTP , if you do not find it then kindly check your spam folder."
          );
          rest.otpModalUtils.toggleShow();
          rest.forgetPasswordUtils.toggleShow();
          rest.show(false);
          rest.toggleShow(false);
        }
      })

      .catch((err) => {
        // console.log(err, "error incoming");
        if (err?.response?.data?.errors) {
          toast.error(err?.response?.data?.errors[0]);
          // otpUtils.toggleShow();
        } else {
          // toast.error("Uh Oh! Something went wrong");
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
      id="forgetpassword-modal"
      // className={clsx(token && ="logged-in")}
      title="Forget Password"
      {...rest}
    >
      <div className="text-center">
        <form onSubmit={formSubmitHandler}>
          {/* {!isMember && (
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
          )} */}
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={inputChangeHandler}
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
        </form>
      </div>
    </Modal>
  );
};

export default ForgetPasswordModal;
