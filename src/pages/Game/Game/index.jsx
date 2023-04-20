import { useCallback, useEffect, useState, useRef } from "react";
import clsx from "clsx";
import $ from "jquery";
import { toast } from "react-toastify";

import Navbar from "../../../components/Navbar";
import GameTextBox from "../../../components/GameTextBox";
import getOccurrenceIndexes from "../../../utils/get-occurrence-indexes";
import isEmpty from "../../../utils/is-empty";
import randInt from "../../../utils/get-random-int";
import Section from "../../../components/Section";
import hintSound from "../../../assets/hint.wav";
import revealSound from "../../../assets/reveal.wav";
import failSound from "../../../assets/fail.mp3";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../../../components/Loader";
import useModal from "../../../hooks/useModal";
import RevealCategoryModal from "../../../modals/RevealCategoryModal";
import Video from "../../../components/Animation";

const rowKeys = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "'"],
  ["z", "x", "c", "v", "b", "n", "m", "-"],
];

function Game({ onSignInOpen, onGameEnd, toggleShowSeeYouSoonModal }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [clue, setClue] = useState("");
  const [fracturedPhrase, setFracturedPhrase] = useState("");
  const [fracturedPhraseArr, setFracturedPhraseArr] = useState([]);
  const [fracturedPraseArrChunked, setfracturedPraseArrChunked] = useState([]);
  const [guessesLeft, setGuessesLeft] = useState(3);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [, setCorrectylyGuessedLetters] = useState([]);
  const [lettersToGuess, setLettersToGuess] = useState([]);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [wrong, setWrong] = useState(0);
  const [guessedPhraseArr, setguessedPhraseArr] = useState([]);
  const [guessedPhraseArrWithoutGaps, setGuessedPhraseArrWithoutGaps] =
    useState([]);
  const [guessedPraseArrChunked, setGuessedPraseArrChunked] = useState([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [frazeBeingSet, setFrazeBeingSet] = useState(false);
  const [isCategoryRevealed, setIsCategoryRevealed] = useState(true);
  const [checker, setChecker] = useState([]);
  const revealModalUtils = useModal();
  const [render, setRender] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const counter = localStorage.getItem("FF_GAMES_PLAYED");

  const authData = useSelector((state) => state.auth);
  const { token, lastPlayed } = useSelector((state) => state.auth);

  // CHECK IF LIMIT OF GAMES HAS REACHED

  const hasPlayingLimit = useCallback(() => {
   
    let gamesPlayed = localStorage.getItem("FF_GAMES_PLAYED");
    let lastPlayedDate = localStorage.getItem("FF_LAST_PLAYED_DATE");

    // console.log(gamesPlayed, "game played")
    const now = new Date();
    // const hours = now.getHours();
    // const minutes = now.getMinutes();
    const lastPlayedTimestamp = new Date(lastPlayedDate);
    // console.log(lastPlayedTimestamp.getTime(), "lastplayedddd")
    const nextDay = lastPlayedTimestamp.getTime() + 24 * 60 * 60 * 1000;
    // console.log(
    //   now.getDate() > lastPlayedTimestamp.getDate() &&
    //     Math.abs(now.getTime() - lastPlayedTimestamp.getTime()) >= 75350502,
    //   "main condition"
    // );
    // console.log(
    //   Math.abs(now.getTime() - lastPlayedTimestamp.getTime()),
    //   "math difference"
    // );

    if (!isNaN(lastPlayedTimestamp)) {
      // console.log("pehla if");

      if (
        now.getDate() > lastPlayedTimestamp.getDate() &&
        Math.abs(now.getTime() - lastPlayedTimestamp.getTime()) >= 75350502
      ) {
        gamesPlayed = 0;
        localStorage.setItem("FF_GAMES_PLAYED", 0);
        return true;
      }

      // if (lastPlayedTimestamp.getHours() <= 7 && now.getHours() > 7) {
      //   if (lastPlayedTimestamp.getDate() <= now.getDate()) {
      //     gamesPlayed = 0;
      //     localStorage.setItem("FF_GAMES_PLAYED", 0);
      //     return true;
      //   }
      //   if (gamesPlayed <= 2) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }

      // if (lastPlayedTimestamp.getHours() > 7 && now.getHours >= 7) {
      //   if (lastPlayedTimestamp.getDate() < now.getDate()) {
      //     gamesPlayed = 0;
      //     localStorage.setItem("FF_GAMES_PLAYED", 0);
      //     return true;
      //   }
      //   if (gamesPlayed <= 2) {
      //     return true;
      //   }
      // }
      // if (lastPlayedTimestamp.getHours() > 7 && now.getHours() < 7) {
      //   if (lastPlayedTimestamp.getDate() < now.getDate()) {
      //     gamesPlayed = 0;
      //     localStorage.setItem("FF_GAMES_PLAYED", 0);
      //     return true;
      //   }
      //   if (gamesPlayed <= 2) {
      //     return true;
      //   }
      // }

      // if (
      //   now.getHours() >= 8 &&
      //   now.getTime() > lastPlayedTimestamp.getTime() + nextDay
      // ) {
      //   console.log("doosra if");
      //   gamesPlayed = 0;
      //   localStorage.setItem("FF_GAMES_PLAYED", 0);

      //   return true;
      // }
      //   if ( now.getTime() < lastPlayedTimestamp.getTime()+ nextDay ) {
      //     if(gamesPlayed <=2){
      //     console.log("doosra if")
      //    return true
      //   }
      //   else{
      //     console.log(false, "false araha hai yahan");
      //     toggleShowSeeYouSoonModal("open");
      //     return false;

      //   }
      // }

      // if(now.getTime() < lastPlayedTimestamp.getTime()+ nextDay && gamesPlayed >=2){
      //   console.log(false, "false araha hai yahan");
      //   toggleShowSeeYouSoonModal("open");
      //   return false;

      // }

      // if (lastPlayedTimestamp.getDate() <= now.getDate()) {
      //   if (lastPlayedTimestamp.getHours() <= 7 && now.getHours() > 7) {
      //     gamesPlayed = 0;
      //     localStorage.setItem("FF_GAMES_PLAYED", 0);
      //     return true;
      //   }
      //   if (
      //     lastPlayedTimestamp.getHours() >= 7 &&
      //     lastPlayedTimestamp.getDate() < now.getDate()
      //   ) {
      //     gamesPlayed = 0;
      //     localStorage.setItem("FF_GAMES_PLAYED", 0);
      //     return true;
      //   }
      // } else {
      //   console.log(false, "false araha hai yahan");
      //   toggleShowSeeYouSoonModal("open");
      //   return false;
      // }
      if (lastPlayedTimestamp.getDate() === now.getDate()) {
        if (lastPlayedTimestamp.getHours() <= 7 && now.getHours() >= 8) {
          gamesPlayed = 0;
          localStorage.setItem("FF_GAMES_PLAYED", 0);
          return true;
        }
        if (gamesPlayed <= 2) {
          return true;
        }
      } else {
        toggleShowSeeYouSoonModal("open");
        return false;
      }
    }
    // console.log(lastPlayedTimestamp, "timestamp")

    // if (gamesPlayed >= 3 && hours === 23 && minutes >= 59 ) {
    //   nextDay8am.setDate(nextDay8am.getDate() + 1);
    //   nextDay8am.setHours(8, 0, 0, 0);
    //   console.log(false)
    //   return false
    // } if (gamesPlayed >= 3 && hours < 23 ) {
    //   nextDay8am.setDate(nextDay8am.getDate());
    //   nextDay8am.setHours(8, 0, 0, 0);
    //   console.log(false)
    //   return false
    // }
    // else{
    //   console.log(true)
    //   console.log(gamesPlayed)
    //   return true;
    // }

    // if ( gamesPlayed >= 3 && now.getTime() > nextDay8am.getTime()) {
    //   localStorage.setItem("FF_GAMES_PLAYED", 0);
    //   gamesPlayed = 0;
    // if(gamesPlayed <= 3 && now.getTime() <= nextDay8am.getTime()){
    //   return false
    // }
    // else {
    //   return true
    // }

    // }
    // if ( gamesPlayed >= 3 && now.getTime() > nextDay8am.getTime()) {
    //   localStorage.setItem("FF_GAMES_PLAYED", 0);
    //   gamesPlayed = 0;
    // if(gamesPlayed <= 3 && now.getTime() <= nextDay8am.getTime()){
    //   return false
    // }
    // else {
    //   return true
    // }

    // }

    const lastPlayedDateObj = new Date(lastPlayedDate);
    // console.log(lastPlayedDateObj, "timestamp")

    let diffBwLastPlayed;
    if (!isNaN(lastPlayedDateObj)) {
      diffBwLastPlayed =
        (new Date().getTime() - lastPlayedDateObj.getTime()) / (1000 * 60 * 60);
    }
    if (diffBwLastPlayed > 24) {
      localStorage.setItem("FF_GAMES_PLAYED", 0);
      gamesPlayed = 0;
    }
    // if the variable is there in localStorage and a day has not been passed yet
    if (gamesPlayed >= 3 && diffBwLastPlayed < 24) {
      if (gamesPlayed >= 3) {
        // toast.info(
        //   "Please log in if you have an existing account, to continue playing. If you don't have an account, please sign up",
        //   { toastId: "games_toast" }
        // );
        toggleShowSeeYouSoonModal("open");
        return false; //change to false before deploy
      }
    } else {
      return true;
    }
  }, []);

  // RESET GAME

  const resetGame = () => {
    if (hasPlayingLimit()) {
      initFraze();
      setGameRunning(true);
      setGuessesLeft(3);
      setHintsLeft(3);
      setWrong(0);
      setCorrectylyGuessedLetters([]);
      setGuessedLetters([]);
      setguessedPhraseArr([]);
      setIsCategoryRevealed(true);
      setRender(!render);
    } else {
      setGameRunning(false);
    }
  };

  // CHECK IF ANSWER IS CORRECT (CALLED ON TAKING HINT AND KEYBOARD PRESS)
  //###

  const arrayFilter = (arr, key) => {
    const newArr = [];
    let flag = false;
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      if (element === key && flag === false) {
        flag = true;
        newArr.push("*");
        continue;
      }
      newArr.push(element);
    }
    return newArr;
  };

  const getOccurrenceIndex = (arr, val) => {
    const result = arr.indexOf(val);
    if (result === -1) return [];
    return [result];
  };

  const checkAnswer = (key, origin, newHints) => {
    if (!gameRunning) {
      return;
    }
    //###
    // setGuessedLetters((prevState) => {
    //   return [...prevState, key];
    // });

    // const occurrenceIndexes = getOccurrenceIndexes(fracturedPhraseArr, key);

    const occurrenceIndexes = getOccurrenceIndex(checker, key);
    const myArr = arrayFilter(checker, key);

    let sound = failSound;

    // IF ENTERED CHARACTER IS NOT THE PART OF FRACTURED PHRAZE
    if (isEmpty(occurrenceIndexes)) {
      setGuessesLeft((prevState) => {
        return prevState - 1;
      });
      setWrong((prevState) => {
        if (prevState < 3) {
          return prevState + 1;
        }
      });
      setHintsLeft((prevState) => {
        // if (prevState === 0) return prevState;
        // else {
        //   return prevState - 1;
        // }
        return prevState - 1;
      });
      const audio = new Audio(sound);
      audio.volume = 0.1;
      audio.play();

      return;
    }

    sound = hintSound;

    if (origin === "keyboard") {
      sound = revealSound;
    }

    const audio = new Audio(sound);
    audio.volume = 0.3;
    audio.play();

    // IF ENTERED CHARACTER IS A THE PART OF FRACTURED FRAZE

    setCorrectylyGuessedLetters((prevState) => {
      return [...prevState, key];
    });

    // LETTERS THAT ARE STILL TO BE GUESSED

    setLettersToGuess((prevState) => {
      const newLetters = [...prevState];

      // const idxs = getOccurrenceIndexes(newLetters, key);
      const idxs = getOccurrenceIndex(newLetters, key);

      idxs.forEach((place, idx) => {
        newLetters.splice(place - idx, 1);
      });
      // GAME WON (NO LETTERS LEFT TO GUESS)

      if (newLetters.length === 0) {
        setGameRunning(false);

        onGameEnd("won", newHints || hintsLeft, guessesLeft);
      }
      return newLetters;
    });

    let newGuessedPhraseArr = [...guessedPhraseArr];

    occurrenceIndexes.forEach((place, idx) => {
      newGuessedPhraseArr[place] = key;
    });
    setguessedPhraseArr(newGuessedPhraseArr);
    // setFracturedPhraseArr(myArr);
    setChecker(myArr);
  };

  // HANDLE KEYBOARD INPUT (CHECK ANSWER)

  const keyClickHandler = (e, key) => {
    checkAnswer(key, "keyboard");
  };

  // TAKE HINT

  const takeHintHandler = () => {
    let letter;

    // if (hintsLeft === 1) {
    //   toast.info("you ran out of hints", { toastId: "games_toast" });
    //   return;
    // }

    setGuessesLeft((prevState) => prevState - 1);
    if (hintsLeft === 2) {
      setHintsLeft((prevState) => {
        letter = lettersToGuess[0];
        checkAnswer(letter, "hint", prevState - 1);

        return prevState - 1;
      });
    } else if (hintsLeft > 0) {
      setHintsLeft((prevState) => {
        letter = lettersToGuess[randInt(0, lettersToGuess.length - 1)];
        checkAnswer(letter, "hint", prevState - 1);

        return prevState - 1;
      });
    }
  };

  // REVEAL CATEGORY

  const revealCategoryHandler = () => {
    if (!isCategoryRevealed) {
      setHintsLeft((prevState) => {
        if (prevState > 0) {
          setIsCategoryRevealed(true);
          return prevState - 1;
        }
        return prevState;
      });
    }
  };

  // INITIALIZE FRAZE

  const initFraze = useCallback(() => {
    // const randomPhraze =
    //   constants.frazez[selectedCategory.toLocaleLowerCase()][
    //     randInt(
    //       0,
    //       constants.frazez[selectedCategory.toLocaleLowerCase()].length
    //     )
    //   ];
    // const key = Object.keys(randomPhraze)[0].toUpperCase();
    // const val = Object.values(randomPhraze)[0].toUpperCase();

    // setClue(key);
    // setFracturedPhrase(val);

    setFrazeBeingSet(true);

    axios
      .get("/games/fraze")
      .then((res) => {
        const { category, fraze, clue } = res.data.fraze;
        setSelectedCategory(category.toUpperCase());
        setFracturedPhrase(fraze.toUpperCase());
        setClue(clue.toUpperCase());
        setGameRunning(true);
      })
      .catch((err) => {
        // console.log(err);
        if (err?.response?.data?.msg) {
          toast.error(err?.response?.data?.msg, {
            toastId: "fetching_fraze_toast",
          });
        } else {
          toast.error("Something went wrong while fetching your fraze", {
            toastId: "fetching_fraze_toast",
          });
        }
        setGameRunning(false);
      })
      .finally(() => {
        setFrazeBeingSet(false);
      });
  }, [selectedCategory]);

  // INITIALIZE FRAZE ON PAGE LOAD

  useEffect(() => {
    setFracturedPhrase("");
    if (hasPlayingLimit()) {
      setRender(!render);
    } else {
      setGameRunning(false);
    }
  }, [token]);

  // SETTING THE FRACTURED ARRAY FOR USER

  useEffect(() => {
    let hiddenString = [];
    let fracturedArr = [];

    for (let i = 0; i < fracturedPhrase.length; i++) {
      const letter = fracturedPhrase[i];
      let hiddenLetter = "_";

      if (letter === " ") {
        hiddenLetter = " ";
      }

      hiddenString.push(hiddenLetter);
      fracturedArr.push(letter);
    }

    setguessedPhraseArr(hiddenString);
    setFracturedPhraseArr(fracturedArr);
    setChecker(fracturedArr);
    // console.log(fracturedPhrase);
  }, [fracturedPhrase]);

  // SETTING GUESSED ARRAY WITHOUT GAPS

  useEffect(() => {
    let arr = [];
    let arr2 = [];
    let arr3 = [];
    guessedPhraseArr.forEach((el) => {
      if (el !== " ") {
        arr.push(el);

        arr2.push(el);
      } else {
        arr3.push(arr2);
        arr2 = [];
      }
    });
    arr3.push(arr2);
    setGuessedPhraseArrWithoutGaps(arr);
    setGuessedPraseArrChunked(arr3);
  }, [guessedPhraseArr]);

  // SETTING FRACTURED FRAZE ARRAY WITHOUT GAPS

  useEffect(() => {
    let arr2 = [];
    let arr3 = [];
    fracturedPhraseArr.forEach((el) => {
      if (el !== " ") {
        arr2.push(el);
      } else {
        arr3.push(arr2);
        arr2 = [];
      }
    });
    arr3.push(arr2);
    setfracturedPraseArrChunked(arr3);
  }, [fracturedPhraseArr]);

  // SETTING ARRAY OF ALL LETTERS, THAT ARE STILL TO BE GUESSED

  useEffect(() => {
    let arr = [];
    fracturedPhraseArr.forEach((el) => {
      if (el !== " ") {
        arr.push(el);
      }

      setLettersToGuess(arr);
    });
  }, [fracturedPhraseArr]);

  // GAME LOST

  useEffect(() => {
    if (hintsLeft === -1) {
      setGameRunning(false);
      onGameEnd("lost", hintsLeft, guessesLeft);
    }
  }, [hintsLeft, guessesLeft]);

  // GAME WON

  // useEffect(() => {
  //   if (!isEmpty(guessedPhraseArrWithoutGaps)) {
  //     let areAllGuessed = true;

  //     guessedPhraseArrWithoutGaps.forEach((el) => {
  //       if (el === "_") {
  //         areAllGuessed = false;
  //       }
  //     });

  //     if (areAllGuessed) {
  //       setGameRunning(false);
  //       onGameEnd("won", hintsLeft, guessesLeft);
  //     }
  //   }
  // }, [hintsLeft, guessesLeft, guessedPhraseArrWithoutGaps]);

  useEffect(() => {
    const ev = document.addEventListener("click", function (e) {
      if (
        e.target.parentElement !==
        document.querySelector(".game-text-box.category-box")
      ) {
        $(".game-text-box.category-box .options").slideUp();
      }
    });

    return () => {
      document.removeEventListener("click", ev);
    };
  }, []);

  useEffect(() => {}, [render]);
  useEffect(() => {
    if (counter < 3) {
      initFraze();
    }
  }, []);

  useEffect(() => {
    setTimeout(function () {
      setShowVideo(false);
    }, 4000);
  }, []);

  if (frazeBeingSet) {
    return <Loader />;
  } else {
    return (
      <div>
        <div
          style={{
            display: showVideo && window.innerWidth > 600 ? "block" : "none",
          }}
        >
          <Video />
        </div>
        <div
          style={{
            display: showVideo && window.innerWidth > 600 ? "none" : "block",
          }}
        >
          <Section id="game">
            {/* <RevealCategoryModal
              {...revealModalUtils}
              onCancel={() => revealModalUtils.toggleShow("close")}
              onConfirm={revealCategoryHandler}
            /> */}

            <Navbar
              setRender={setRender}
              render={render}
              showHints
              hintsLeft={hintsLeft}
              gameRunning={gameRunning}
              onSignInOpen={onSignInOpen}
              takeHintHandler={takeHintHandler}
              // isCategoryRevealed={isCategoryRevealed}
            />

            <div className="d-flex align-items-center flex-column mt-md-4 mt-2 text-center">
              {fracturedPhrase && selectedCategory && (
                <GameTextBox className="category-box labeller lg">
                  <div className="left">CATEGORY :</div>{" "}
                  <div
                    className={clsx(
                      "right",
                      !isCategoryRevealed && "c-pointer",
                      hintsLeft === 0 && "disabled"
                    )}
                    onClick={() => {
                      if (!isCategoryRevealed) {
                        revealModalUtils.toggleShow();
                      }
                    }}
                  >
                    {isCategoryRevealed
                      ? selectedCategory.toUpperCase()
                      : "CLICK TO REVEAL "}
                  </div>
                </GameTextBox>
              )}
              {fracturedPhrase && clue && (
                <GameTextBox className="clue-box text-center">
                  {clue.toUpperCase()}
                </GameTextBox>
              )}
            </div>

            <div className="guessed-phrase">
              {guessedPraseArrChunked.map((item, idx1) => {
                return (
                  <div className="word" key={"word" + idx1}>
                    {item.map((el, idx2) => {
                      let toShow = el;
                      let wasEmpty = false;
                      let isGuessed = false;
                      let incompleteShow = false;

                      if (toShow === "_") {
                        if (gameRunning) {
                          toShow = " ";
                        } else {
                          toShow = fracturedPraseArrChunked[idx1][idx2];
                          incompleteShow = true;
                        }
                      } else {
                        isGuessed = true;
                      }

                      return (
                        <GameTextBox
                          className={clsx({
                            "in-visible": wasEmpty,
                            "is-guessed": isGuessed,
                            "incomplete-show": incompleteShow,
                          })}
                          key={"guessed-letter" + idx1 + idx2}
                        >
                          {toShow}
                        </GameTextBox>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="lives-wrap">
              <div className="lives-box">
                <div
                  style={{ display: wrong > 2 ? "block" : "none" }}
                  className={clsx(wrong > 2 && "show")}
                >
                  X
                </div>
                <div
                  style={{ display: wrong > 1 ? "block" : "none" }}
                  className={clsx(wrong > 1 && "show")}
                >
                  X
                </div>
                <div
                  style={{ display: wrong > 0 ? "block" : "none" }}
                  className={clsx(wrong > 0 && "show")}
                >
                  X
                </div>
              </div>
            </div>
            <br />
            <div className={clsx({ disabled: !gameRunning }, "keyboard-wrap")}>
              <div className="keyboard">
                {!gameRunning && (
                  <div className="reset-btn" onClick={resetGame}>
                    <img src="/assets/vectors/reset.svg" alt="reset" />
                  </div>
                )}
                {rowKeys.map((row, idx) => {
                  return (
                    <div key={"board-row" + idx} className="board-row">
                      {row.map((el, idx) => {
                        return (
                          <div
                            key={el}
                            className={clsx(
                              "board-key",
                              guessedLetters.includes(el.toUpperCase())
                            )}
                            onClick={(e) =>
                              keyClickHandler(e, el.toUpperCase())
                            }
                          >
                            {el.toUpperCase()}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        </div>
      </div>
    );
  }
}

export default Game;
