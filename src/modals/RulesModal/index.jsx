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
      title="Game Rules"
      {...rest}
    >
      <OtpModal {...otpUtils} />

      <div className="text-center">
        <form>
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
          {/* <div className="form-control">
            <label htmlFor="email">Rules</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={inputChangeHandler}
            />
          </div> */}
          <div className="form-controll">
            {/* <h1>GAME RULE</h1> */}
            <div className="content">
              <p>
                <strong>Fractured Frazez </strong> is a free online word game.
              </p>
              <p>
                Registered players can play 3 games a day to earn gold, silver, or bronze
                medals.   They will also have their scores posted on the leaderboard.  Guest
                players can play just 1 game a day and will not earn any medals.
              </p>
              <p>
                To get a GOLD MEDAL in <strong>Fractured Frazez</strong> you must be the BEST,
                which means no hint and no clue.
              </p>

              <p>
                A <strong>hint</strong> is a drop-down-letter and a <strong>clue </strong> is a
                category. The game starts WITHOUT the category showing. It only appears if the
                player chooses to get a clue. Players have the option of asking for either a
                hint or a clue but you forfeit the gold medal.
              </p>
              <p>
                Using the keyboard, players click on letters until the answer is revealed. If a
                letter appears more than once, it must be entered individually.
              </p>

              <p>
                You are always trying for the GOLD medal at the start of a game. {" "}
                <strong>
                  But be very careful as you will not get a second chance at this because as
                  soon as you enter a wrong letter the game is over and the answer will be
                  revealed.
                </strong>
                   Remember, no hint or clue when playing for GOLD.
              </p>

              <table>
                <thead></thead>

                <tbody>
                  <tr>
                    <th className="table-left">Actions</th>
                    <th className="table-right">Reward</th>
                  </tr>
                  <tr>
                    <td>Solve the answer with no clue or hint </td>
                    <td>Gold Medal</td>
                  </tr>
                  <tr>
                    <td> Solve the answer with a clue </td>
                    <td>Silver Medal</td>
                  </tr>
                  <tr>
                    <td>Solve the answer with a clue and a hint </td>

                    <td>Bronze Medal</td>
                  </tr>
                  <tr>
                    <td>Solve the answer with a clue and two hints </td>
                    <td>You still get a Bronze Medal!</td>
                  </tr>
                </tbody>
                <tfoot />
              </table>
            </div>
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
          {/*   
          <button className="submit btn" disabled={isLoading}>
            Submit
          </button> */}
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

export default RulesModal;
