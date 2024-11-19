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
import { message } from "antd";

export default function ResetPassword() {
  const [disabled, setDisabled] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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

  const { handleSubmit, register } = methods;

  const onSubmit = (data) => {
    setDisabled(true);
    setRequestError(false);

    postData("/auth/request-reset-password", data, {})
      .then((response) => {
        console.log("Success:", response);
        setDisabled(false);
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
            <div className="flex flex-col justify-center px-10">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-700">
                  Quên mật khẩu
                </h3>
                <p className="mt-2 text-gray-500">
                  Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.
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
                        Gửi yêu cầu
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
          </div>
        </div>
      </section>
    </>
  );
}
