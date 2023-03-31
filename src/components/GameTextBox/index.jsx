import React from "react";
import clsx from "clsx";

const GameTextBox = ({ className, children, ...rest }) => {
  return (
    <div className={clsx("game-text-box", className)} {...rest}>
      {children}
    </div>
  );
};

export default GameTextBox;
