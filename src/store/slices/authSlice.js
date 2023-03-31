import { createSlice } from "@reduxjs/toolkit";

import setAuthHeader from "../../utils/set-auth-header";

const initialState = {
  token: null,
  _id: null,
  name: null,
  email: null,
  lastPlayed: {
    games: 0,
    date: new Date(),
  },
  authSet: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { token, _id, name, email, lastPlayed, authSet } = action.payload;
      state.token = token;
      state._id = _id;
      state.name = name;
      state.email = email;
      state.lastPlayed = lastPlayed;
      if (typeof authSet !== "undefined") state.authSet = authSet;

      if (token) {
        localStorage.setItem("token", token);
        setAuthHeader(token);
      }
    },

    removeUser: (state, action) => {
      state._id = null;
      state.email = null;
      state.token = null;
      state.email = null;
      state.lastPlayed = null;
      localStorage.removeItem("token");
      setAuthHeader();
    },

    setGamesPlayed: (state, action) => {
      state.lastPlayed.games = action.payload.games;
      state.lastPlayed.date = action.payload.date;
    },
  },
});

export default userSlice.reducer;
export const { setUser, removeUser, setGamesPlayed } = userSlice.actions;
