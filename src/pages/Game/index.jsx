import { useEffect, useCallback, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

import Game from "./Game";
import useModal from "../../hooks/useModal";
import FinishModal from "../../modals/FinishModal";
import isEmpty from "../../utils/is-empty";
import { setGamesPlayed } from "../../store/slices/authSlice";
import SeeYouSoonModal from "../../modals/SeeYouSoonModal";

function GameWrapper() {
  const finishModalUtils = useModal(false);
  const { toggleShow: tommorowModalTogalShow, show: tommorowModalShow } = useModal(false);
  const { toggleShow: finishToggleShow, setMeta: finishSetMeta } = finishModalUtils;
  const { token, lastPlayed } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(
    localStorage.getItem("FF_GAMES_PLAYED")
  );

  const gameEndHandler = useCallback((intent, hints, guesses) => {
    console.log("i ran");
    if (!token) {
      const lastPlayedDate = localStorage.getItem("FF_LAST_PLAYED_DATE");
      const gamesPlayed = localStorage.getItem("FF_GAMES_PLAYED");

      let newGamesPlayed = 0;
      if (gamesPlayed) {
        if (gamesPlayed > 3) {
          const lastPlayedDateObj = new Date(lastPlayedDate);
          let diffBwLastPlayed = 0;
          if (!isNaN(lastPlayedDateObj)) {
            diffBwLastPlayed =
              (new Date().getTime() - lastPlayedDateObj.getTime()) / (1000 * 60 * 60);
            if (diffBwLastPlayed > 24) {
              newGamesPlayed = 0;
            } else {
              newGamesPlayed = 1;
            }
          } else {
            newGamesPlayed += 1;
          }
        } else newGamesPlayed = +gamesPlayed + 1;
      } else {
        newGamesPlayed = 1;
      }

      localStorage.setItem("FF_GAMES_PLAYED", newGamesPlayed);
      localStorage.setItem("FF_LAST_PLAYED_DATE", new Date());
    }
    // axios
    //   .post("/games", {
    //     hintsUsed: 3 - hints,
    //     wrongGuesses: 1 - guesses,
    //     // wrongGuesses: guesses,
    //     intent,
    //     date: d,
    //   })
    //   .then((res) => {
    //     dispatch(setGamesPlayed({ ...res?.data?.user?.lastPlayed }));

    //     if (res?.data?.user?.lastPlayed?.games === 3) {
    //       localStorage.setItem("FF_GAMES_PLAYED", 1);
    //       localStorage.setItem("FF_LAST_PLAYED_DATE", d);
    //     }
    //   })
    //   .catch((err) => {
    //     // console.log(err);
    //     // console.log(err?.response?.data);

    //     if (!token) {
    //       // toast.info(
    //       //   "Please log in if you have an existing account, to add your score to the leaderboard. If you don't have an account, please sign up.",

    //       //   { position: toast.POSITION.TOP_RIGHT, toastId: "game_info_toast" }
    //       // );

    //       let unsavedGames = JSON.parse(localStorage.getItem("FF_UNSAVED_GAMES"));

    //       const game = {
    //         hintsUsed: 3 - hints,
    //         wrongGuesses: 1 - guesses,
    //         intent,
    //         date: new Date(),
    //       };

    //       if (!isEmpty(unsavedGames)) {
    //         unsavedGames.unshift(game);
    //       } else {
    //         unsavedGames = [game];
    //       }

    //       localStorage.setItem("FF_UNSAVED_GAMES", JSON.stringify(unsavedGames));
    //     } else {
    //       toast.error("Uh Oh! Something went wrong while saving your data on our servers");
    //     }
    //   });
    finishSetMeta({
      hints,
      guesses,
      intent,
      gameId: Date.now(),
    });
    finishToggleShow();
  }, []);

  useEffect(() => {
    if (totalGamesPlayed >= 3) {
      // console.log(lastPlayed?.games);
      tommorowModalTogalShow("open");
    }
  }, [lastPlayed]);

  return (
    <>
      <SeeYouSoonModal show={tommorowModalShow} toggleShow={tommorowModalTogalShow} />
      <FinishModal {...finishModalUtils} />
      <Game onGameEnd={gameEndHandler} toggleShowSeeYouSoonModal={tommorowModalTogalShow} />
    </>
  );
}

export default GameWrapper;
