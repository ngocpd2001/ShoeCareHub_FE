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

import { getData, postData } from "../../api/api";
import ComSelect from "../../Components/ComInput/ComSelect";
import ComModal from "./../../Components/ComModal/ComModal";
import { useModalState } from "../../hooks/useModalState";
export default function RegisterOwner() {
  const [token, setToken] = useStorage("token", "");
  const [user, setUser] = useStorage("user", null);
  const [role, setRole] = useStorage("role", null);
  const [disabled, setDisabled] = useState(false);
  const [LoginState, setLogin] = useState(false);
  const [LoginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const modal = useModalState();

  const Messenger = yup.object({
    email: yup
      .string()
      .trim()
      .email("Email không hợp lệ")
      .required("Mail đăng nhập không được để trống"),
    phone: yup
      .string()
      .trim()
      .matches(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ")
      .required("Số điện thoại không được để trống"),
    name: yup
      .string()
      .trim()
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(50, "Tên không được vượt quá 50 ký tự")
      .required("Tên không được để trống"),
    fullName: yup
      .string()
      .trim()
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(50, "Tên không được vượt quá 50 ký tự")
      .required("Tên không được để trống"),
    gender: yup
      .string()
      .oneOf(["MALE", "FEMALE"], "Vui lòng chọn giới tính hợp lệ")
      .required("Giới tính không được để trống"),
    password: yup
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(16, "Mật khẩu không được vượt quá 16 ký tự")
      .required("Mật khẩu không được để trống"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng nhập lại mật khẩu"),
  });
  const LoginRequestDefault = {
    email: "",
    password: "",
  };
  const methods = useForm({
    resolver: yupResolver(Messenger),
    defaultValues: {
      email: "",
      password: "",
    },
    values: LoginRequestDefault,
  });
  const { handleSubmit, register, setFocus, watch, setValue, setError } =
    methods;
  const onSubmit = (data) => {
    setDisabled(true);
    setLoginError(false);
    setLogin(false);
    postData(
      "/auth/owner-register",
      { customerRegister: data, createBusiness: { name: data.name } },
      {}
    )
      .then((data) => {
        console.log(111111, data);
        modal.handleOpen();
        setDisabled(false);
      })
      .catch((error) => {
        console.error("1111111 Error fetching items:", error);
        setDisabled(false);
        setLoginError(true);
        switch (error?.data?.message) {
          case "Số điện thoại đã được sử dụng!":
            setFocus("phone");
            setError("phone", {
              message: "Số điện thoại đã được sử dụng!",
            });
            break;
          case "Email đã được sử dụng!":
            setFocus("email");
            setError("email", {
              message: "Email đã được sử dụng!",
            });
            break;
          default:
            break;
        }
      });
  };

  return (
    <>
      <ComModal onClose={modal.handleClose} isOpen={modal.isModalOpen}>
        <div
          className=" p-6 w-full max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Đăng ký tài khoản doanh nghiệp thành công!
          </h2>
          <p className="text-gray-700 mb-6">
            Vui lòng kiểm tra email của bạn để xác nhận tài khoản.
          </p>
          <button
            onClick={() => {
              modal.handleClose();
              setTimeout(() => {
                navigate("/login");
              }, 1500);
            }}
            className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Đóng
          </button>
        </div>
      </ComModal>
      <section
        className="flex items-center justify-center  w-screen bg-cover bg-center pt-6 pb-10 bg-slate-100 "
        style={
          {
            // backgroundImage: `url(${logo2})`,
          }
        }
      >
        <div className="w-full max-w-4xl h-auto bg-white rounded-3xl shadow-lg border border-[#c3c3c3] ">
          <div className="grid grid-cols-1 lg:grid-cols-1  ">
            <div className="flex flex-col justify-center px-10">
              <div className="  text-center ">
                <h3 className="text-3xl font-bold text-gray-700 pt-4">
                  Đăng ký doanh nghiệp
                </h3>
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
                        placeholder={"Nhập tên doanh nghiệp"}
                        label={"Tên doanh nghiêp"}
                        type="text"
                        {...register("name")}
                        required
                      />
                    </div>
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
                        placeholder={"Số điện thoại"}
                        label={"Số điện thoại"}
                        type="text"
                        {...register("phone")}
                        required
                      />
                    </div>
                    <div>
                      <ComInput
                        placeholder={"Tên của bạn"}
                        label={"Tên của bạn"}
                        type="text"
                        {...register("fullName")}
                        required
                      />
                    </div>

                    <div>
                      <ComSelect
                        size={"large"}
                        style={{
                          width: "100%",
                        }}
                        label="Giới tính"
                        placeholder="Giới tính"
                        onChangeValue={(e, value) => {
                          setValue(e, value);
                        }}
                        value={watch("gender")}
                        mode="default"
                        options={[
                          {
                            value: "MALE",
                            label: `Nam`,
                          },
                          {
                            value: "FEMALE",
                            label: `Nữ`,
                          },
                        ]}
                        required
                        {...register("gender")}
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
                      <ComInput
                        placeholder={"Nhập lại mật khẩu"}
                        label={"Mật khẩu"}
                        type="password"
                        // maxLength={16}
                        {...register("confirmPassword")}
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
                        Đăng ký
                      </ComButton>

                      <Link to="/login" className=" text-sky-600">
                        Đăng nhập
                      </Link>
                      <Link to="/register" className=" text-sky-600">
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
