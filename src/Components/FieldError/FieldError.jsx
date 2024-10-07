import React from "react";

export const FieldError = ({ children, className = "", ...props }) => {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  );
};
