import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ComInput from "../../Components/ComInput/ComInput";
import ComButton from "../../Components/ComButton/ComButton";
import { ComLink } from "../../Components/ComLink/ComLink";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FieldError } from "../../Components/FieldError/FieldError";
import logo2 from "../../assets/images/logo2.webp";
import { postData } from "../../api/api";
import { Input, message, Typography } from "antd";
import { useStorage } from "../../hooks/useLocalStorage";
const { Title } = Typography;
export default function LoginOtp() {
  const [disabled, setDisabled] = useState(false);
  const [otp, setOtp] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useStorage("token", "");
  const [user, setUser] = useStorage("user", null);
  const resetPasswordSchema = yup.object({
    email: yup
      .string()
      .trim()
      .email("Email không hợp lệ")
      .required("Mail không được để trống"),
  });

  const methods = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, register, watch } = methods;

  const onSubmit = (data) => {
    setDisabled(true);
    setRequestError(false);

    postData("/auth/request-otp-code", data, {})
      .then((response) => {
        console.log("Success:", response);
        setDisabled(false);
        setOtp(true);
        // Hiển thị thông báo thành công
        message.success("Vui lòng kiểm tra địa chỉ mail");
      })
      .catch((error) => {
        console.error("Error:", error);
        setDisabled(false);
        setRequestError(true);
        setErrorMessage("Mail không tồn tại");
      });
  };
  const onChange = (text) => {
    console.log("onChange:", text);
    postData("/auth/login-by-otp", {
      email: watch("email"),
      otp: text,
    })
      .then((response) => {
        console.log("ádasds:", response);

        // Hiển thị thông báo thành công
        message.success("Đăng nhập thành công ");
        setToken(response.data.token);
        setUser(response.data);
        return new Promise((resolve) => {
          setTimeout(() => {
            switch (response.data?.role) {
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
                setDisabled(false);

                setErrorMessage(
                  "Tài khoản không được phép đăng nhập vào hệ thống"
                );
                break;
            }
            resolve(); // Báo hiệu Promise đã hoàn thành
          }, 0); // Thời gian chờ 0ms để đảm bảo setToken đã được thực hiện
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Mã OTP không hợp lệ ");
      });
  };

  return (
    <>
      <section className="flex items-center justify-center w-screen bg-cover bg-center pt-6">
        <div className="w-full max-w-4xl h-auto bg-white bg-opacity-90 rounded-3xl shadow-lg border border-[#c3c3c3]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:block">
              <img
                className="object-cover w-full h-full rounded-3xl"
                src={logo2}
                alt="Reset Password Image"
              />
            </div>
            {!otp ? (
              <div className="flex flex-col justify-center px-10">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-700">
                    Đăng nhập bằng OTP
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Vui lòng nhập email của bạn để nhận OTP.
                  </p>
                </div>
                <FormProvider {...methods}>
                  <div className="flex flex-col items-center">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6 max-w-xl m-4 min-w-full"
                    >
                      <div>
                        <ComInput
                          placeholder={"Nhập địa chỉ email"}
                          label={"Email"}
                          type="email"
                          {...register("email")}
                          required
                        />
                      </div>
                      <FieldError className="text-red-500 text-center">
                        {requestError ? errorMessage : ""}
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
                        <Link to="/login" className="text-sky-600">
                          Đăng nhập
                        </Link>
                        <Link to="/register" className="text-sky-600">
                          Đăng ký
                        </Link>
                      </div>
                    </form>
                  </div>
                </FormProvider>
              </div>
            ) : (
              <div className="flex flex-col justify-center px-10">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-700">
                    Đăng nhập bằng OTP
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Vui lòng nhập mã otp để đăng nhập.
                  </p>
                </div>
                <FormProvider {...methods}>
                  <div className="flex flex-col items-center">
                    <form
                      // onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6 max-w-xl m-4 min-w-full"
                    >
                      <Title level={5}>Vui lòng nhật mã</Title>
                      <div className="flex justify-center">
                        <Input.OTP
                          formatter={(str) => str.toUpperCase()}
                          onChange={onChange}
                        />
                      </div>

                      <div className="mt-4 text-center gap-3 flex flex-col">
                        <Link to="/login" className="text-sky-600">
                          Đăng nhập
                        </Link>
                        <Link to="/register" className="text-sky-600">
                          Đăng ký
                        </Link>
                      </div>
                    </form>
                  </div>
                </FormProvider>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
