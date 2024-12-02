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
import { firebaseImg } from "./../../upImgFirebase/firebaseImg";
import ComUpImgOne from "./../../Components/ComUpImg/ComUpImgOne";
import ComDatePicker from "./../../Components/ComDatePicker/ComDatePicker";
import { cccdRegex } from "./../../regexPatterns";
export default function RegisterOwner() {
  const [token, setToken] = useStorage("token", "");
  const [user, setUser] = useStorage("user", null);
  const [role, setRole] = useStorage("role", null);
  const [disabled, setDisabled] = useState(false);
  const [LoginState, setLogin] = useState(false);
  const [LoginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [frontCitizenImage, setFrontCitizenImage] = useState(null);
  const [backCitizenImage, setBackCitizenImage] = useState(null);
  const navigate = useNavigate();
  const modal = useModalState();

  const Messenger = yup.object().shape({
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
      .min(2, "Tên doanh nghiệp phải có ít nhất 2 ký tự")
      .max(50, "Tên doanh nghiệp không được vượt quá 50 ký tự")
      .required("Tên doanh nghiệp không được để trống"),
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
    dob: yup
      .string()
      .typeError("Ngày sinh không hợp lệ")
      .required("Ngày sinh không được để trống"),
    password: yup
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(16, "Mật khẩu không được vượt quá 16 ký tự")
      .required("Mật khẩu không được để trống"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp")
      .required("Vui lòng nhập lại mật khẩu"),
    businessPhone: yup
      .string()
      .trim()
      .matches(
        /^(0|\+84)[0-9]{9,10}$/,
        "Số điện thoại doanh nghiệp không hợp lệ"
      )
      .required("Số điện thoại doanh nghiệp không được để trống"),
    // citizenIdnumber: yup
    //   .string()
    //   .trim()
    //   .matches(cccdRegex, "Vui lòng nhập đúng số CMND/CCCD ( 12 chữ số)")

    //   .required("Số CMND/CCCD không được để trống"),
  });

  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    gender: "",
    dob: "",
    name: "",
    businessPhone: "",
    // citizenIdnumber: "",
  };

  const methods = useForm({
    resolver: yupResolver(Messenger),
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    setFocus,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    setDisabled(true);
    setLoginError(false);
    setLogin(false);

    // if (!frontCitizenImage) {
    //   setDisabled(false);
    //   alert("Vui lòng chọn hình ảnh mặt trước CMND/CCCD");
    //   return;
    // }
    // if (!backCitizenImage) {
    //   setDisabled(false);
    //   alert("Vui lòng chọn hình ảnh mặt sau CMND/CCCD");
    //   return;
    // }

    try {
      // Upload ảnh lên Firebase
      //       const frontImageUrl = await firebaseImg(frontCitizenImage);
      //       const backImageUrl = await firebaseImg(backCitizenImage);
      // console.log(watch("dob"));
      // console.log(frontImageUrl);
      // console.log(backImageUrl);
      const customerRegister = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        fullName: data.fullName,
        phone: data.phone,
        gender: data.gender,
        dob: data.dob,
      };

      const createBusiness = {
        name: data.name,
        businessPhone: data.businessPhone,
        // citizenIdnumber: data.citizenIdnumber,
        // frontCitizenImageUrl: frontImageUrl,
        // backCitizenImageUrl: backImageUrl,
      };

      const requestData = { customerRegister, createBusiness };
      console.log("====================================");
      console.log(222, requestData);
      console.log("====================================");
      const responseData = await postData("/auth/owner-register", requestData);

      console.log("Registration successful:", responseData);
      modal.handleOpen();
      setDisabled(false);
    } catch (error) {
      console.error("Error during registration:", error);
      setDisabled(false);
      setLoginError(true);
      // Xử lý lỗi
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
    }
  };

  return (
    <>
      <ComModal onClose={modal.handleClose} isOpen={modal.isModalOpen}>
        <div
          className="p-6 w-full max-w-md mx-auto"
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
      <section className="flex items-center justify-center w-screen bg-cover bg-center pt-6 pb-10 bg-slate-100">
        <div className="w-full max-w-4xl h-auto bg-white rounded-3xl shadow-lg border border-[#c3c3c3]">
          <div className="grid grid-cols-1 lg:grid-cols-1">
            <div className="flex flex-col justify-center px-10">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-700 pt-4">
                  Đăng ký doanh nghiệp
                </h3>
                <p className="mt-2 text-gray-500">
                  Chào mừng đến với Shoe Care Hub!
                </p>
              </div>
              <FormProvider {...methods}>
                <div className="flex flex-col items-center">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 max-w-xl m-4 min-w-full"
                  >
                    {/* Thông tin tài khoản */}
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
                        {...register("password")}
                        required
                      />
                    </div>
                    <div>
                      <ComInput
                        placeholder={"Nhập lại mật khẩu"}
                        label={"Nhập lại mật khẩu"}
                        type="password"
                        {...register("confirmPassword")}
                        required
                      />
                    </div>
                    {/* Thông tin cá nhân */}
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
                      <ComInput
                        placeholder={"Số điện thoại"}
                        label={"Số điện thoại"}
                        type="text"
                        {...register("phone")}
                        required
                      />
                    </div>
                    <div>
                      <ComSelect
                        size={"large"}
                        style={{ width: "100%" }}
                        label="Giới tính"
                        placeholder="Giới tính"
                        onChangeValue={(e, value) => {
                          setValue(e, value);
                        }}
                        value={watch("gender")}
                        mode="default"
                        options={[
                          { value: "MALE", label: "Nam" },
                          { value: "FEMALE", label: "Nữ" },
                        ]}
                        required
                        {...register("gender")}
                      />
                    </div>
                    <div>
                      <ComDatePicker
                        placeholder={"Ngày sinh"}
                        label={"Ngày sinh"}
                        {...register("dob")}
                        required
                      />
                    </div>
                    {/* Thông tin doanh nghiệp */}
                    <div>
                      <ComInput
                        placeholder={"Nhập tên doanh nghiệp"}
                        label={"Tên doanh nghiệp"}
                        type="text"
                        {...register("name")}
                        required
                      />
                    </div>
                    <div>
                      <ComInput
                        placeholder={"Số điện thoại doanh nghiệp"}
                        label={"Số điện thoại doanh nghiệp"}
                        type="text"
                        {...register("businessPhone")}
                        required
                      />
                    </div>
                    {/* <div>
                      <ComInput
                        placeholder={"Số CMND/CCCD"}
                        label={"Số CMND/CCCD"}
                        type="text"
                        {...register("citizenIdnumber")}
                        required
                      />
                    </div> */}
                    {/* Upload hình ảnh */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hình ảnh mặt trước CMND/CCCD
                      </label>
                      <ComUpImgOne
                        onChange={(data) => setFrontCitizenImage(data)}
                        label={"Hình ảnh mặt trước CMND/CCCD"}
                        error={
                          !frontCitizenImage ? "Vui lòng chọn hình ảnh" : ""
                        }
                        required
                      />
                    </div> */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Hình ảnh mặt sau CMND/CCCD
                      </label>
                      <ComUpImgOne
                        onChange={(data) => setBackCitizenImage(data)}
                        label={"Hình ảnh mặt sau CMND/CCCD"}
                        error={
                          !backCitizenImage ? "Vui lòng chọn hình ảnh" : ""
                        }
                        required
                      />
                    </div> */}

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
