import { Button } from "antd";
import React from "react";

const ComButton = React.forwardRef(
  (
    {
      endIcon,
      className = "",
      textColor = "text-white",
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        type="default"
        size="large"
        className={`flex w-44 mg mx-auto justify-center bg-[#0F296D] px-3 py-1.5 text-sm font-semibold leading-6 
          shadow-sm focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:bg-[#0F296D] ${textColor} ${className}`}
        {...props}
        onClick={endIcon ? undefined : onClick}
      >
        {children}
      </Button>
    );
  }
);

export default ComButton;
