import { Button } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const ComLink = ({
  className,
  disabled = false,
  children,
  ...props
}) => {
  const navigate = useNavigate();
  return (
    // <Button
    //   type="link"
    //   size="large"
    //   shape="round"
    //   className="font-semibold text-indigo-600 hover:text-indigo-500 p-1"
    //   onClick={() => {
    //     navigate(props.to, { replace: true });
    //   }}
    // >
    <Link
      {...props}
      className={`font-semibold text-indigo-600 hover:text-indigo-500 ${className}`}
      style={{ textDecorationSkipInk: "none", textUnderlineOffset: "4px" }}
    >
      {children}
    </Link>
    // </Button>
  );
};
