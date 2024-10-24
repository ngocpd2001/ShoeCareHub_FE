import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ComInput from "../../Components/ComInput/ComInput";
import ComButton from "../../Components/ComButton/ComButton";
import { ComLink } from "../../Components/ComLink/ComLink";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FieldError } from "../../Components/FieldError/FieldError";
import { useStorage } from "../../hooks/useLocalStorage";
import logo2 from "../../assets/images/logo2.webp";

import { getData, postData } from "../../api/api";
export default function LoginPage(props) {
  const [token, setToken] = useStorage("token", "");
  const [role, setRole] = useStorage("role", null);
  const [disabled, setDisabled] = useState(false);
  const [LoginState, setLogin] = useState(false);
  const [LoginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const loginMessenger = yup.object({
    email: yup.string().trim().required("Mail đăng nhập không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống"),
  });
  const LoginRequestDefault = {
    email: "",
    password: "",
  };
  const methods = useForm({
    resolver: yupResolver(loginMessenger),
    defaultValues: {
      email: "",
      password: "",
    },
    values: LoginRequestDefault,
  });
  const { handleSubmit, register, setFocus, watch, setValue } = methods;
  const onSubmit = (data) => {
    setDisabled(true);
    setLoginError(false);
    setLogin(false);
    postData("/auth/login", data, {})
      .then((data) => {
        console.log(111111, data);
        setToken(data);
        setTimeout(() => {
          navigate("/");
        }, 500);

        // Chờ setToken hoàn thành trước khi navigate
        // return new Promise((resolve) => {
        //   setTimeout(() => {
        //     console.log(data);
        //     switch (data?.listRole[0]) {
        //       case "Staff":
        //         navigate("/staff/contract");
        //         break;
        //       case "Admin":
        //         navigate("/admin/account");
        //         break;
        //       case "Manager":
        //         navigate("/manager/institute");
        //         break;
        //       case "Director":
        //         navigate("/director/dashboard");
        //         break;
        //       case "Nurse":
        //         setDisabled(false);
        //         setLogin(true);
        //         setErrorMessage(
        //           "Tài khoản không được phép đăng nhập vào hệ thống"
        //         );
        //         break;
        //       default:
        //         setDisabled(false);
        //         setLogin(true);
        //         setErrorMessage(
        //           "Tài khoản không được phép đăng nhập vào hệ thống"
        //         );
        //         break;
        //     }
        //     resolve(); // Báo hiệu Promise đã hoàn thành
        //   }, 0); // Thời gian chờ 0ms để đảm bảo setToken đã được thực hiện
        // });
      })
      .catch((error) => {
        console.error("1111111 Error fetching items:", error);
        setDisabled(false);
        if (error?.status === 401) {
          setLogin(true);
          setErrorMessage("Login.message.invalidCredential");
        } else {
          setLoginError(true);
          setErrorMessage("Login.message.loginError");
        }
      });
  };

  return (
    <>
      {/* <Header login={true} /> */}
      <section
        className="flex items-center justify-center  w-screen bg-cover bg-center pt-6  "
        style={
          {
            // backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/careconnect-2d494.appspot.com/o/images%2Fab3611bf-a5f8-4b46-9f42-56fafbaefb5a.jpg?alt=media&token=bc958e0c-35f5-4592-a224-16d476a90536)`,
          }
        }
      >
        <div className="w-full max-w-4xl h-auto bg-white bg-opacity-90 rounded-3xl shadow-lg border border-[#c3c3c3]">
          <div className="grid grid-cols-1 lg:grid-cols-2 ">
            <div className="hidden lg:block">
              <img
                className="object-cover w-full h-full rounded-3xl"
                src={logo2}
                alt="Login Image"
              />
            </div>
            <div className="flex flex-col justify-center px-10">
              <div className="  text-center ">
                <h3 className="text-3xl font-bold text-gray-700">Đăng nhập</h3>
                <p className="mt-2 text-gray-500">
                  Chào mừng đến với Shoe Care Hub!
                </p>
              </div>
              <FormProvider {...methods}>
                <div className="flex flex-col items-center ">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6  max-w-xl m-4 min-w-full"
                  >
                    <div>
                      <ComInput
                        placeholder={"Nhập tài khoản Gmail"}
                        label={"Gmail"}
                        type="text"
                        {...register("email")}
                        required
                      />
                    </div>
                    <div>
                      <ComInput
                        placeholder={"Nhập mật khẩu"}
                        label={"Mật khẩu"}
                        type="password"
                        // maxLength={16}
                        {...register("password")}
                        required
                      />
                    </div>
                    <FieldError className="text-red-500 text-center">
                      {LoginState || LoginError ? errorMessage : ""}
                    </FieldError>
                    <div className="mt-4 text-center gap-3 flex flex-col">
                      <ComButton
                        disabled={disabled}
                        htmlType="submit"
                        type="primary"
                        className="w-full duration-300"
                      >
                        Đăng nhập
                      </ComButton>

                      <Link to="#" className=" text-sky-600">
                        Trang chủ
                      </Link>
                    </div>
                  </form>
                </div>
              </FormProvider>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
