import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../Notification/Notification";
import { YupBranch } from "../../yup/YupBranch";
import { getData, postData, putData } from "../../api/api";
import ComInput from "../../Components/ComInput/ComInput";
import ComSelect from "../../Components/ComInput/ComSelect";
import ComButton from "../../Components/ComButton/ComButton";
import { useStorage } from "./../../hooks/useLocalStorage";
import { YupAddresses } from "./../../yup/YupAddresses";

export default function EditAddressesUser({ onClose, tableRef, selectedData }) {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [user, setUser] = useStorage("user", null);

  const methods = useForm({
    resolver: yupResolver(YupAddresses),
    values: selectedData,
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  // Hàm submit form
  const onSubmit = (data) => {
    // Kiểm tra nếu chưa chọn hình ảnh
    console.log(data);
    console.log(provinces);
    setDisabled(true);

    putData(`/addresses`, user.id, data)
      .then((response) => {
        console.log("Tạo thành công:", response);
        setDisabled(false);
        notificationApi(
          "success",
          "Thành công",
          "Cập nhật địa chỉ thành công."
        );
        tableRef();
        onClose();
      })
      .catch((error) => {
        setDisabled(false);
        console.error("Lỗi:", error);
        notificationApi("error", "Lỗi", `${error?.data?.message}`);
      });
  };

  useEffect(() => {
    getData("locations/provinces")
      .then((e) => {
        console.log(e.data);
        const dataForSelect = e?.data?.map((item) => ({
          value: item.provinceID,
          label: item.provinceName,
          data: item,
        }));
        setProvinces(dataForSelect);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    setValue("districtId", null);
    getData(`locations/${watch("provinceId")}/districts`)
      .then((e) => {
        console.log(e.data);
        const dataForSelect = e?.data?.map((item) => ({
          value: item.districtID,
          label: item.districtName,
          data: item,
        }));
        setDistricts(dataForSelect);
      })
      .catch(() => {});
  }, [watch("provinceId")]);
  console.log(1111, watch("provinceId"));
  console.log("districts", watch("district"));

  useEffect(() => {
    setValue("wardCode", null);
    getData(`locations/${watch("districtId")}/wards`)
      .then((e) => {
        console.log(e.data);
        const dataForSelect = e?.data?.map((item) => ({
          value: item.wardCode,
          label: item.wardName,
          data: item,
        }));
        setWards(dataForSelect);
      })
      .catch(() => {});
  }, [watch("districtId")]);

  useEffect(() => {
    setValue("districtId", selectedData.districtId);
    setValue("wardCode", selectedData.wardCode);
    getData(`locations/${selectedData.districtId}/wards`)
      .then((e) => {
        console.log(e.data);
        const dataForSelect = e?.data?.map((item) => ({
          value: item.wardCode,
          label: item.wardName,
          data: item,
        }));
        setWards(dataForSelect);
      })
      .catch(() => {
        setWards([]);
      });
  }, [selectedData]);
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 ml-4">
        Thêm Địa chỉ
      </h2>

      <div className="">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto ">
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="mt-2.5 sm:col-span-2">
                  <ComSelect
                    type="text"
                    label={"Tỉnh"}
                    value={watch("provinceId")}
                    options={provinces}
                    placeholder={"Tỉnh"}
                    showSearch
                    size={"large"}
                    onChangeValue={(e, value) => {
                      setValue(e, value, { shouldValidate: true });
                      console.log(55555, value);
                    }}
                    style={{
                      width: "100%",
                    }}
                    required
                    {...register("provinceId")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComSelect
                    type="text"
                    label={"Huyện"}
                    options={districts}
                    value={watch("districtId")}
                    size={"large"}
                    showSearch
                    style={{
                      width: "100%",
                    }}
                    onChangeValue={(e, value) => {
                      setValue(e, value);
                    }}
                    placeholder={"Huyện"}
                    required
                    {...register("districtId")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComSelect
                    type="text"
                    value={watch("wardCode")}
                    label={"Phường"}
                    options={wards}
                    showSearch
                    size={"large"}
                    style={{
                      width: "100%",
                    }}
                    onChangeValue={(e, value) => {
                      setValue(e, value);
                    }}
                    placeholder={"Phường"}
                    required
                    {...register("wardCode")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="text"
                    label={"Địa chỉ"}
                    placeholder={"Địa chỉ"}
                    required
                    {...register("address")}
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-6">
                <div>
                  <ComButton
                    className={`block w-full rounded border-[#E0E2E7] border-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] ${" bg-[#F0F1F3]"}`}
                  >
                    <div className="text-black"> Hủy bỏ</div>
                  </ComButton>
                </div>
                <div>
                  <ComButton
                    htmlType="submit"
                    disabled={disabled}
                    className={`block w-full rounded border-[#E0E2E7] border-md bg-[#0F296D] text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] ${
                      disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {disabled ? "Đang tạo..." : "Tạo mới"}
                  </ComButton>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
