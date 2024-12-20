import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "../../../Notification/Notification";
import ComInput from "../../../Components/ComInput/ComInput";
import ComButton from "../../../Components/ComButton/ComButton";
import { getData, postData } from "../../../api/api";

import { YupBranch } from "./../../../yup/YupBranch";
import ComSelect from "../../../Components/ComInput/ComSelect";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useStorage } from "../../../hooks/useLocalStorage";
// Thiết lập icon cho Marker (khắc phục vấn đề với icon mặc định của Leaflet)

export default function CreateBranch({ onClose, tableRef }) {
  const [disabled, setDisabled] = useState(false);
  const { notificationApi } = useNotification();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [user, setUser] = useStorage("user", null);
  const [address, setAddress] = useState(""); // Trạng thái để lưu địa chỉ
  const [userData, setUserData] = useState({});
  const methods = useForm({
    resolver: yupResolver(YupBranch),
  });
  const [data, setData] = useState([]);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const reloadData = () => {
    getData(`/businesses/${user.businessId}`)
      .then((e) => {
        // Giả sử dữ liệu trả về nằm trong e.data.data
        setUserData(e?.data.data);
        console.log("Dữ liệu user", e?.data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
    getData(`/branches/business/${user.businessId}`)
      .then((e) => {
        setData(e?.data?.data);
        console.log("====================================");
        console.log(3333,e?.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };
  useEffect(() => {
    reloadData();
  }, []);
  // Hàm submit form
  const onSubmit = (data) => {
    // Kiểm tra nếu chưa chọn hình ảnh
    console.log(data);
    console.log(provinces);
    // const province = provinces.find(
    //   (item) =>
    //     item.value.toString().toLowerCase() === data.province.toLowerCase()
    // );
    // const district = districts.find(
    //   (item) =>
    //     item.value.toString().toLowerCase() === data.district.toLowerCase()
    // );
    // const ward = wards.find(
    //   (item) => item.value.toString().toLowerCase() === data.ward.toLowerCase()
    // );
    // console.log(12321321, province);
    // console.log(12321321, district);
    // console.log(12321321, ward);
    console.log("====================================");
    // console.log(province);
    console.log("====================================");
    postData(`/branches`, {
      ...data,
      // province: province.label,
      // district: district.label,
      // ward: ward.label,
      isDeliverySupport: true,
    })
      .then((response) => {
        console.log("Tạo thành công:", response);
        setDisabled(false);
        notificationApi(
          "success",
          "Thành công",
          "Chi nhánh đã được tạo thành công."
        );
        setTimeout(() => {
          if (tableRef.current) {
            // Kiểm tra xem ref đã được gắn chưa
            tableRef.current.reloadData();
          }
        }, 100);
        onClose();
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
      .catch(() => {
        setProvinces([]);
      });
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
      .catch(() => {
        setDistricts([]);
      });
  }, [watch("provinceId")]);
  console.log(1111, watch("province"));
  console.log("districts", watch("districtId"));

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
      .catch(() => {
        setWards([]);
      });
  }, [watch("districtId")]);

  if (userData.isIndividual) {
    if (data.length >= 1) {
      return (
        <div>
          <div className="  text-yellow-600 text-center">
            <div className="flex items-center gap-2 justify-center">
              <XCircle className="w-6 h-6" />
              Bạn đã quá hạn chi nhánh được tạo! Vui lòng đăng ký gói tính năng để
              sử dụng .
            </div>
            <Link className="text-teal-500" to={"/owner/feature-packs"}>
              Đăng ký gói tính năng
            </Link>
          </div>
        </div>
      );
    }
  }
  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-800 mb-4 ml-4">
        Thêm chi nhánh  
      </h2>

      <div className="">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto ">
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="mt-2.5 sm:col-span-2">
                  <ComInput
                    type="text"
                    label={"Tên chi nhánh"}
                    placeholder={"Tên chi nhánh"}
                    required
                    {...register("name")}
                  />
                </div>
                {/* <div className="mt-2.5 sm:col-span-2">
                  <ComSelect
                    type="text"
                    label={"Thành phố"}
                    placeholder={"Thành phố"}
                    required
                    size={"large"}
                    showSearch
                    style={{
                      width: "100%",
                    }}
                    options={provinces}
                    {...register("city")}
                  />
                </div> */}
                <div className="mt-2.5 sm:col-span-2">
                  <ComSelect
                    type="text"
                    label={"Tỉnh/Thành phố"}
                    value={watch("provinceId")}
                    options={provinces}
                    placeholder={"Tỉnh/Thành phố"}
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
                    label={"Quận/Huyện"}
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
                    placeholder={"Quận/Huyện"}
                    required
                    {...register("districtId")}
                  />
                </div>
                <div className="mt-2.5 sm:col-span-2">
                  <ComSelect
                    type="text"
                    value={watch("wardCode")}
                    label={"Phường/Xã"}
                    options={wards}
                    size={"large"}
                    showSearch
                    style={{
                      width: "100%",
                    }}
                    onChangeValue={(e, value) => {
                      setValue(e, value);
                    }}
                    placeholder={"Phường/Xã"}
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
