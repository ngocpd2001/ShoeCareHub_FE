import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ComInput from "../../Components/ComInput/ComInput";
import ComButton from "../../Components/ComButton/ComButton";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FieldError } from "../../Components/FieldError/FieldError";
import { putData } from "../../api/api";
import { message } from "antd";

export default function ResetPasswordSuccess() {
  const [disabled, setDisabled] = useState(false);
  const [resetError, setResetError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy AccountId và Token từ URL
  const queryParams = new URLSearchParams(location.search);
  const AccountId = queryParams.get("AccountId");
  const Token = queryParams.get("Token");

  const resetPasswordSchema = yup.object().shape({
    password: yup
      .string()
      .required("Mật khẩu không được để trống")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .matches(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 ký tự đặc biệt"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng nhập lại mật khẩu"),
  });

  const methods = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, register } = methods;

  const onSubmit = (data) => {
    setDisabled(true);
    setResetError(false);

    const apiUrl = `/auth/reset-password?AccountId=${AccountId}&Token=${Token}`;

    putData("/auth", `reset-password?AccountId=${AccountId}&Token=${Token}`, {
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    })
      .then((response) => {
        console.log("Success:", response);
        setDisabled(false);
        // Hiển thị thông báo thành công
        message.success("Đặt lại mật khẩu thành công");
        // Chuyển hướng đến trang đăng nhập
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error:", error);
        setDisabled(false);
        setResetError(true);
        setErrorMessage("Đặt lại mật khẩu thất bại");
      });
  };

  return (
    <>
      <section className="flex items-center justify-center w-screen bg-cover bg-center pt-6">
        <div className="w-full max-w-4xl h-auto bg-white bg-opacity-90 rounded-3xl shadow-lg border border-[#c3c3c3]">
          <div className="flex flex-col justify-center px-10">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-700">
                Đặt lại mật khẩu
              </h3>
              <p className="mt-2 text-gray-500">
                Vui lòng nhập mật khẩu mới của bạn.
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
                      placeholder={"Nhập mật khẩu mới"}
                      label={"Mật khẩu mới"}
                      type="password"
                      {...register("password")}
                      required
                    />
                  </div>
                  <div>
                    <ComInput
                      placeholder={"Nhập lại mật khẩu mới"}
                      label={"Nhập lại mật khẩu mới"}
                      type="password"
                      {...register("confirmPassword")}
                      required
                    />
                  </div>
                  <FieldError className="text-red-500 text-center">
                    {resetError ? errorMessage : ""}
                  </FieldError>
                  <div className="mt-4 text-center gap-3 flex flex-col">
                    <ComButton
                      disabled={disabled}
                      htmlType="submit"
                      type="primary"
                      className="w-full duration-300"
                    >
                      Đặt lại mật khẩu
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
      </section>
    </>
  );
}
