import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";

import Game from "./pages/Game";
import LeaderBoard from "./pages/LeaderBoard";
import GameRecord from "./pages/GameRecord";
import checkAuthState from "./utils/check-auth-state";
import { removeUser, setUser } from "./store/slices/authSlice";
import isEmpty from "./utils/is-empty";
import setAuthHeader from "./utils/set-auth-header";
import Loader from "./components/Loader";
import { Helmet } from "react-helmet";

const App = () => {
  const { token, authSet } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // axios.defaults.baseURL = "https://ffraze.herokuapp.com/api";
  axios.defaults.baseURL = "https://fracctured.fracturedfrazez.com/api";
  // axios.defaults.baseURL = "http://192.168.0.105:5000/api";
  //https://fracctured.fracturedfrazez.com/api
  //http://192.168.0.110:5000"

  // axios.defaults.baseURL = "https://murmuring-citadel-86761.herokuapp.com/api";
  // axios.defaults.baseURL = "https://glacial-wildwood-13132.herokuapp.com/api";

  useEffect(() => {
    dispatch(setUser(checkAuthState()));
  }, [dispatch]);

  useEffect(() => {
    async function checkUser() {
      if (token) {
        try {
          const { data } = await axios.get("/users/" + jwt_decode(token)._id);

          const thatDay = new Date(data.user.lastPlayed.date);
          const dayAfterThatDay = new Date(thatDay.getTime() + 60 * 60 * 24 * 1000);
          const thisDay = new Date();
          if (thisDay > dayAfterThatDay) {
            data.user.lastPlayed.games = 0;
          }
          dispatch(setUser({ ...data.user, token }));
        } catch (err) {
          // console.log(err);
          // console.log(err?.response?.status);

          // if (err?.response?.status === 404) {
          setAuthHeader();
          localStorage.removeItem("token");
          dispatch(removeUser());
          // }
        }
      }
    }

    checkUser();
  }, [dispatch, token]);

  // useEffect(() => {
  //   if (token) {
  //     const games = JSON.parse(localStorage.getItem("FF_UNSAVED_GAMES"));
  //     if (!isEmpty(games)) {
  //       axios
  //         .post("/games/multiple", { games, date: new Date() })
  //         .then((res) => {
  //           localStorage.removeItem("FF_UNSAVED_GAMES");

  //           if (res?.data?.user?.lastPlayed?.games === 3) {
  //             localStorage.setItem("FF_GAMES_PLAYED", 1);
  //             localStorage.setItem("FF_LAST_PLAYED_DATE", new Date());
  //           }
  //         })
  //         .catch((err) => {
  //           // console.log(err);
  //         });
  //     }
  //   }
  // }, [token]);

  // console.log(authSet);

  if (authSet) {
    return (
      <>
        <ToastContainer />
        <GoogleOAuthProvider clientId="946246116008-flathlehq2nh08iah0ktvae1os6v4nsj.apps.googleusercontent.com">
          <Router>
            <Helmet>
              <meta charSet="utf-8" />
              <title>:: Fractured Frazez ::</title>
            </Helmet>
            <Routes>
              <Route path="/" element={<Game />} />
              <Route path="/leaderboard" element={<LeaderBoard />} />
              <Route path="/game/:id" exact element={<GameRecord />} />
            </Routes>
          </Router>
        </GoogleOAuthProvider>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default App;
