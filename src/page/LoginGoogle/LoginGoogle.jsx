import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getData } from "../../api/api";
import { message } from "antd";
import { useStorage } from "../../hooks/useLocalStorage";

export default function LoginGoogle() {
  const location = useLocation();
  const [token, setToken] = useStorage("token", "");
  const [user, setUser] = useStorage("user", null);
  const navigate = useNavigate();

  // Tạo instance của URLSearchParams để lấy giá trị query parameter
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("token");
  console.log("====================================");
  console.log(email);
  console.log("====================================");
  useEffect(() => {
    getData(`/auth/get-by-token?token=${email}`)
      .then((data) => {
        console.log(2222222,data);
        setToken(data.data.data.token);
        setUser(data.data.data);
        message.success(`Đăng nhập thành công`);
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(data);
            switch (data.data.data?.role) {
              case "OWNER":
                navigate("/owner/order");
                break;
              case "CUSTOMER":
                navigate("/");
                break;
              case "EMPLOYEE":
                navigate("/employee/order");
                break;
              case "ADMIN":
                navigate("/admin/user");
                break;
              case "MODERATOR":
                navigate("/moderator/Feedback");
                break;
              default:
                navigate("/");
                break;
            }
            resolve(); // Báo hiệu Promise đã hoàn thành
          }, 0); // Thời gian chờ 0ms để đảm bảo setToken đã được thực hiện
        });
      })
      .catch((error) => {
        console.log(error);
        message.error(`Đăng nhập thất bại vui lòng thử lại`);
      });
  }, []);
  return <div></div>;
}
