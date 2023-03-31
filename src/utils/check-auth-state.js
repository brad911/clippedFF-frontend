import jwt_decode from "jwt-decode";

import setAuthHeader from "./set-auth-header";

const checkAuthState = () => {
  const token = localStorage.getItem("token");

  if (token) {
    setAuthHeader(token);
    const decoded = jwt_decode(token);
    const thatDay = new Date(decoded?.lastPlayed?.date);
    const dayAfterThatDay = new Date(thatDay.getTime() + 60 * 60 * 24 * 1000);
    const thisDay = new Date();

    if (thisDay > dayAfterThatDay) {
      decoded.lastPlayed.games = 0;
    }

    return { token, ...decoded, authSet: true };
  } else {
    return {
      token: null,
      _id: null,
      email: null,
      name: null,
      lastPlayed: null,
      authSet: true,
    };
  }
};

export default checkAuthState;
