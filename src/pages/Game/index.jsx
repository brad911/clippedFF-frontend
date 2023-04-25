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
    finishSetMeta({
      hints,
      guesses,
      intent,
      gameId: Date.now(),
    });
    finishToggleShow();
  }, []);

  // useEffect(() => {
  //   console.log(totalGamesPlayed, "<=== total games played")
  //   if (totalGamesPlayed >= 3) {
  //     // console.log(lastPlayed?.games);
  //     tommorowModalTogalShow("open");
  //   }
  //   else {
  //     tommorowModalTogalShow("false");
  //   }
  // }, [totalGamesPlayed]);




  return (
    <>
      <SeeYouSoonModal show={tommorowModalShow} toggleShow={tommorowModalTogalShow} />
      <FinishModal {...finishModalUtils} />
      <Game onGameEnd={gameEndHandler} toggleShowSeeYouSoonModal={tommorowModalTogalShow} setTotalGamesPlayed={setGamesPlayed} />
    </>
  );
}

export default GameWrapper;
