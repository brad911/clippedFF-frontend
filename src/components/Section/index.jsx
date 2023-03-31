import clsx from "clsx";
import React from "react";

const Section = ({ className, children, ...rest }) => {
  return (
    <div className={clsx("page-section", className)} {...rest}>
      <div className="page-container">{children}</div>
    </div>
  );
};

export default Section;
