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

import { getData, postData, putData } from "../../api/api";
import ComSelect from "../../Components/ComInput/ComSelect";
import ComModal from "./../../Components/ComModal/ComModal";
import { useModalState } from "../../hooks/useModalState";
import { firebaseImg } from "./../../upImgFirebase/firebaseImg";
import ComUpImgOne from "./../../Components/ComUpImg/ComUpImgOne";
import ComDatePicker from "./../../Components/ComDatePicker/ComDatePicker";
import { cccdRegex } from "./../../regexPatterns";
import { useNotification } from "../../Notification/Notification";
export default function RegisterCustomerToOwner() {
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
  const { notificationApi } = useNotification();

  const Messenger = yup.object().shape({
    name: yup
      .string()
      .trim()
      .min(2, "Tên doanh nghiệp phải có ít nhất 2 ký tự")
      .max(50, "Tên doanh nghiệp không được vượt quá 50 ký tự")
      .required("Tên doanh nghiệp không được để trống"),

    businessPhone: yup
      .string()
      .trim()
      .matches(
        /^(0|\+84)[0-9]{9,10}$/,
        "Số điện thoại doanh nghiệp không hợp lệ"
      )
      .required("Số điện thoại doanh nghiệp không được để trống"),
  });

  const methods = useForm({
    resolver: yupResolver(Messenger),
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
    console.log(data);

    const createBusiness = {
      name: data.name,
      businessPhone: data.businessPhone,
    };
    console.log(createBusiness);

    putData("/accounts", `${user.id}/become-owner`, {
      name: data.name,
      businessPhone: data.businessPhone,
    })
      .then((e) => {
        notificationApi(
          "success",
          "Thành công",
          "Dịch vụ đã được cập nhật thành công."
        );
        console.log(e);
        
        setUser({ ...user, role: "OWNER", businessId: e.data.businessId });
        setTimeout(() => {
          navigate("/owner/service");
        }, 2000);
        setDisabled(false);
      })
      .catch((error) => {
        setDisabled(false);
        setLoginError(true);
        // Xử lý lỗi
        console.log(123,error);

        setFocus("businessPhone");
        setError("businessPhone", {
          message: "Số điện thoại đã được sử dụng!",
        });
      });
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
      <section className="flex items-center justify-center  bg-cover bg-center pt-6 pb-10 ">
        <div className="w-full max-w-4xl h-auto bg-white rounded-3xl shadow-lg border border-[#c3c3c3]">
          <div className="grid grid-cols-1 lg:grid-cols-1">
            <div className="flex flex-col justify-center px-10">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-700 pt-4">
                  Đăng ký doanh nghiệp
                </h3>
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
