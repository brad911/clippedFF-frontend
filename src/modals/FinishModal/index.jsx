import clsx from "clsx";
import React from "react";
import { useEffect } from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";
import winSound from "../../assets/win.wav";
import loseSound from "../../assets/lose.wav";

import Modal from "../../components/Modal";

const FinishModal = ({ intent, hints, guesses, gameId, ...rest }) => {
  useEffect(() => {
    if (intent) {
      let sound = loseSound;

      if (intent === "won") {
        sound = winSound;
      }

      const audio = new Audio(sound);
      audio.play();
    }
  }, [intent]);
  return (
    <Modal
      id="result-modal"
      className={clsx(intent)}
      title={intent === "won" ? "You Won" : "You Lost"}
      {...rest}
    >
      {intent === "won" ? (
        <div className="text-center">
          {/* {hints > -1 ? ( */}
          <>
            {/* <img
              className="vector"
              src={`/assets/imgs/medal-${
                hints === 3
                  ? "gold"
                  : hints === 2
                  ? "silver"
                  : hints === 1
                  ? "bronze"
                  : hints === 0
                  ? "nothing"
                  : "nothing"
              }.jpg`}
              alt="medal"
            /> */}

            {hints === 0 ? (
              <h2 className="fw-500 my-2">"Congratulations."</h2>
            ) : (
              <h2 className="fw-500 my-2">Congratulations! You won.</h2>
            )}
          </>
          {/* ) : (
           <h2 className="fw-500 my-2">
           Congratulations! (Satisfactory Performance)
         </h2>
         )} */}
          <h3>Hints used: {3 - hints}</h3>
          {/* <h3>Wrong Guesses: {1 - guesses}</h3> */}
        </div>
      ) : (
        <div className="text-center">
          <img className="vector" src="/assets/gifs/fail.gif" alt="fail" />

          <h2 className="fw-500 my-2">You couldn't make it. Better luck next time.</h2>
          <h3>Hints used: {2 - hints}</h3>
          {/* <h3>Wrong Guesses: {3 - guesses}</h3> */}
        </div>
      )}
      {intent === "won" && (
        <div className="text-center mt-4 share-btns">
          <FacebookShareButton
            url={"https://fracturedfrazez.com/game/" + gameId}
            quote={"Can you score better than me?"}
            // hashtag={"#hashtag"}
            description={"Check out my scores!"}
            className="Demo__some-network__share-button"
          >
            <FacebookIcon size={32} round /> Share on Facebook
          </FacebookShareButton>
          <br />
          <TwitterShareButton
            title={"Can you score better than me?"}
            url={"https://fracturedfrazez.com/game/" + gameId}
            // hashtags={["hashtag1", "hashtag2"]}
          >
            <TwitterIcon size={32} round />
            Share on Twitter
          </TwitterShareButton>
        </div>
      )}
    </Modal>
  );
};

export default FinishModal;
