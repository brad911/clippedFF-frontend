import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import clsx from "clsx";

import Navbar from "../../components/Navbar";
import Section from "../../components/Section";
import Loader from "../../components/Loader";
import isEmpty from "../../utils/is-empty";
import SignInModal from "../../modals/SignInModal";
import useModal from "../../hooks/useModal";

const LeaderBoard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [constraintState, setConstraintState] = useState("");
  const [data, setData] = useState([
    {
      _id: 1,
      medal: "GOLD",
      player: {
        name: "Alex",
        gender: "male",
      },
      hintsUsed: 0,
      wrongGuesses: 0,
    },
    {
      _id: 2,
      medal: "SILVER",
      player: {
        name: "Melida",
        gender: "female",
      },
      hintsUsed: 0,
      wrongGuesses: 0,
    },
    {
      _id: 3,
      medal: "BRONZE",
      player: {
        name: "Alex",
        gender: "male",
      },
      hintsUsed: 0,
      wrongGuesses: 0,
    },
    {
      _id: 4,
      medal: "",
      player: {
        name: "Melida",
        gender: "female",
      },
      hintsUsed: 0,
      wrongGuesses: 0,
    },
  ]);
  const { token } = useSelector((state) => state.auth);
  const signInModalUtils = useModal(false);

  const setFilter = (val) => {
    setConstraintState((prevState) => {
      if (prevState === val) return "";
      else return val;
    });
  };

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(`/games?constraint=${constraintState}`)
      .then((res) => {
        setData(res.data.users);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Uh Oh! Something went wrong while fetching data");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [constraintState]);

  return (
    <Section id="leaderboard">
      <SignInModal {...signInModalUtils} />
      {isLoading && <Loader />}
      <Navbar />

      <div className="date-selector">
        <div>
          <div
            className={clsx("btn", constraintState === "TODAY" && "active")}
            onClick={() => setFilter("TODAY")}
          >
            TODAY
            <div className="icons">
              <img src="/assets/imgs/date.png" alt="date" />
            </div>
          </div>
        </div>
        <div>
          <div
            className={clsx("btn", constraintState === "WEEK" && "active")}
            onClick={() => setFilter("WEEK")}
          >
            THIS WEEK
            <div className="icons">
              <img src="/assets/imgs/date.png" alt="date" />
              <img src="/assets/imgs/date.png" alt="date" />
            </div>
          </div>
        </div>
        <div>
          <div
            className={clsx("btn", constraintState === "MONTH" && "active")}
            onClick={() => setFilter("MONTH")}
          >
            THIS MONTH
            <div className="icons">
              <img src="/assets/imgs/date.png" alt="date" />
              <img src="/assets/imgs/date.png" alt="date" />
              <img src="/assets/imgs/date.png" alt="date" />
            </div>
          </div>
        </div>
      </div>

      <div className="min-page-container mt-5">
        {!token && (
          <div className="join">
            <img className="tada" src="/assets/imgs/tada.png" alt="tada" />
            <img className="check" src="/assets/imgs/check.png" alt="check" />
            <div className="d-none d-sm-block"></div>
            <div className="center">YOU CAN BE HERE</div>

            <div className="right">
              <button className="login" onClick={() => signInModalUtils.toggleShow()}>
                LOGIN HERE
              </button>
            </div>
          </div>
        )}

        <div className="game-listing-items">
          {isLoading ? (
            <div className="text-center my-5">
              <h1>Loading...</h1>
            </div>
          ) : (
            data.map((el, idx) => {
              const {
                _id,
                name,
                gender,
                goldMedalsWon = 0,
                silverMedalsWon = 0,
                bronzeMedalsWon = 0,
                // hintsUsed,
                // wrongGuesses,
                // createdAt,
              } = el;

              if (isEmpty(el.games)) {
                return <React.Fragment key={_id}></React.Fragment>;
              }

              let userImg = "user-male";

              if (gender === "female") {
                userImg = "user-female";
              }

              return (
                <div className="game-listing-item" key={_id}>
                  <div className="tag">{idx + 1}</div>
                  <div className="game-listing-item__main">
                    <div className="left">
                      <img src={`/assets/imgs/${userImg}.png`} alt="gender" />
                    </div>
                    <div className="center">{name}</div>
                    <div className="right">
                      <div>
                        {goldMedalsWon}
                        <img src="/assets/imgs/medal-1.png" alt="gold" />
                      </div>
                      <div>
                        {silverMedalsWon}
                        <img src="/assets/imgs/medal-2.png" alt="gold" />
                      </div>
                      <div>
                        {bronzeMedalsWon}
                        <img src="/assets/imgs/medal-3.png" alt="gold" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Section>
  );
};

export default LeaderBoard;
