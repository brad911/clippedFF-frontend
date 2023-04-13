import React from "react";
import gif from "../../assets/loading.gif";

const Loader = () => {
  return (
    <div className="preloader" style={{ backgroundColor: "#2B6486" }}>
      {/* <div className="lds-hourglass"></div> */}
      <img src={gif}></img>
    </div>
  );
};

export default Loader;
