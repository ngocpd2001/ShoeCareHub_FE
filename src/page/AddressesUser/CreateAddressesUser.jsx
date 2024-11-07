import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../Notification/Notification";
import { YupBranch } from "../../yup/YupBranch";
import { getData, postData } from "../../api/api";
import ComInput from "../../Components/ComInput/ComInput";
import ComSelect from "../../Components/ComInput/ComSelect";
import ComButton from "../../Components/ComButton/ComButton";
import { useStorage } from './../../hooks/useLocalStorage';
import { YupAddresses } from './../../yup/YupAddresses';

export default function CreateAddressesUser({ onClose, tableRef }) {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [user, setUser] = useStorage("user", null);

  const methods = useForm({
    resolver: yupResolver(YupAddresses),
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
    const province = provinces.find(
      (item) =>
        item.value.toString().toLowerCase() === data.province.toLowerCase()
    );
    const district = districts.find(
      (item) =>
        item.value.toString().toLowerCase() === data.district.toLowerCase()
    );
    const ward = wards.find(
      (item) => item.value.toString().toLowerCase() === data.ward.toLowerCase()
    );

    postData(`/addresses`, {
      ...data,
      accountId: user.id,
      province: province.label,
      district: district.label,
      ward: ward.label,
      isDefault: false,
    })
      .then((response) => {
        console.log("Tạo thành công:", response);
        setDisabled(false);
        notificationApi(
          "success",
          "Thành công",
          "Địa chỉ đã được tạo thành công."
        );
        tableRef()
        onClose()
      })
      .catch((error) => {
        setDisabled(false);
        console.error("Lỗi:", error);
        notificationApi("error", "Lỗi", `${error.data.message}`);
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
    setValue("district", null);
    getData(`locations/${watch("province")}/districts`)
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
  }, [watch("province")]);
  console.log(1111, watch("province"));
  console.log("districts", watch("district"));

  useEffect(() => {
    setValue("ward", null);
    getData(`locations/${watch("district")}/wards`)
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
  }, [watch("district")]);
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
                    value={watch("province")}
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
                    {...register("province")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComSelect
                    type="text"
                    label={"Huyện"}
                    options={districts}
                    value={watch("district")}
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
                    {...register("district")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComSelect
                    type="text"
                    value={watch("ward")}
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
                    {...register("ward")}
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
