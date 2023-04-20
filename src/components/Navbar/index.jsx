import React, { useState } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import SignInModal from "../../modals/SignInModal";
import { removeUser } from "../../store/slices/authSlice";
import useModal from "../../hooks/useModal";
import ForgetPasswordModal from "../../modals/ForgetPasswordModal";
import OtpModal from "../../modals/otp";
import RulesModal from "../../modals/RulesModal";
import leaderCup from "../../assets/leader.svg";
import GameTextBox from "../GameTextBox";
import LogoutModal from "../../modals/logoutModal";
import ContactUsModal from "../../modals/ContactUsModal";

const Navbar = ({
  showHints,
  hintsLeft,
  takeHintHandler,
  gameRunning,
  isCategoryRevealed,
  setRender,
  render,
}) => {
  const { token } = useSelector((state) => state.auth);
  const signInModalUtils = useModal(false);
  const forgetpasswordUtils = useModal(false);
  const contactUtils = useModal(false);
  const otpUtils = useModal(false);
  const rulesUtils = useModal(false);
  const [fracturedPhrase, setFracturedPhrase] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  // const [isCategoryRevealed, setIsCategoryRevealed] = useState(false);
  const revealModalUtils = useModal();
  const logoutUtils = useModal();

  const dispatch = useDispatch();

  // LOGOUT THE USER FROM THE APP

  const logoutHandler = () => {
    dispatch(removeUser());
  };

  return (
    <>
      <OtpModal {...otpUtils} />
      <ForgetPasswordModal {...forgetpasswordUtils} />
      <SignInModal {...signInModalUtils} />
      <RulesModal {...rulesUtils} />
      <LogoutModal {...logoutUtils} />
      <ContactUsModal {...contactUtils} />
      {/* <RevealCategoryModal
          {...revealModalUtils}
          onCancel={() => revealModalUtils.toggleShow("close")}
          onConfirm={revealCategoryHandler}
        /> */}
      <div className="game-title">
        {showHints ? (
          <div className="d-flex gap-2 gap-sm-3">
            {/* <Link to="/leaderboard" className={clsx("white-btn")}>
              <img src={leaderCup} color={"red"} alt="leaderboard" />
            </Link> */}
            {/* <div className="btn" style={{ display: "flex" }}>
              {!token ? (
                <>
                  <button
                    className="btn d-none d-sm-block"
                    onClick={signInModalUtils.toggleShow}
                  >
                    Register/Login
                  </button>
                  <button
                    className={clsx("d-flex d-sm-none white-btn")}
                    onClick={() => {
                      signInModalUtils.toggleShow();
                    }}
                  >
                    <img
                      style={{ width: 28 }}
                      src="/assets/vectors/account.svg"
                      alt="account"
                    />
                  </button>
                </>
              ) : (
                <>
                  <button className="btn d-none d-sm-block" onClick={logoutUtils.toggleShow}>
                    LOGOUT
                  </button>

                  <button
                    className={clsx("d-flex d-sm-none white-btn")}
                    onClick={logoutUtils.toggleShow}
                  >
                    <img style={{ width: 22 }} src="/assets/vectors/logout.svg" alt="logout" />
                  </button>
                </>
              )}
            </div> */}
            <button className="btn" onClick={rulesUtils.toggleShow}>
              {" "}
              GAME PLAY
            </button>
            <button className="btn" onClick={contactUtils.toggleShow}>
              {" "}
              CONTACT US
            </button>
          </div>
        ) : (
          <Link
            onClick={() => {
              setRender(!render);
            }}
            className="white-btn"
            to="/"
          >
            <img src="/assets/vectors/back.svg" alt="game" />
          </Link>
        )}

        <div className="nav d-flex align-items-center gap-2 gap-sm-4">
          {showHints && (
            <div
              className="labeller short"
              style={{ backgroundColor: isCategoryRevealed ? "#fff" : " #ABAAAA" }}
            >
              <div
                onClick={takeHintHandler}
                // style={{ color: isCategoryRevealed ? "#6DCEFF" : "#696969" , backgroundColor : isCategoryRevealed ? "white" : "#ABAAAA" , curosor : isCategoryRevealed ? "pointer" : "unset"}}
                className="left"
                // style={{ color: isCategoryRevealed ? "#6DCEFF" : "#ffff" }}
                style={{ color: "#ffff", backgroundColor: "#6DCEFF" }}
              >
                HINTS
              </div>
              <div
            
                onClick={takeHintHandler}
                style={{
                  // color: isCategoryRevealed ? "white" : "	#696969",
                  color: "white",
                  // backgroundColor: isCategoryRevealed ? "#6DCEFF" : " #ABAAAA",
                  backgroundColor: "#6DCEFF",
                  curosor: isCategoryRevealed ? "pointer" : "unset",
                  
                }}
                className="right"
              >
                {hintsLeft} Left
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
