import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { createAddress } from "../../api/address";
import { Select } from "antd";
import {
  getLocationProvinces,
  getDistrictsByProvinceID,
  getWardsByDistrictID,
} from "../../api/location";

const { Option } = Select;
const EditAddressPopup = ({ onClose }) => {
  const [isDefault, setIsDefault] = useState(false);
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [selectedWardCode, setSelectedWardCode] = useState(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getLocationProvinces();
        console.log("Provinces:", data);
        setProvinces(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvinceId) {
      const fetchDistricts = async () => {
        try {
          const data = await getDistrictsByProvinceID(selectedProvinceId);
          console.log("Districts:", data);
          setDistricts(data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách huyện:", error);

          const provinceName =
            provinces.find(
              (province) => province.provinceID === selectedProvinceId
            )?.provinceName || "không xác định";

          alert(
            `Không thể lấy danh sách huyện cho tỉnh ${provinceName}. Vui lòng thử lại sau.`
          );
        }
      };
      fetchDistricts();
    }
  }, [selectedProvinceId, provinces]);

  useEffect(() => {
    if (selectedDistrictId) {
      const fetchWards = async () => {
        try {
          const data = await getWardsByDistrictID(selectedDistrictId);
          console.log("Wards:", data);
          const processedWards = data.map((ward) => ({
            ...ward,
            code: ward.code ? String(ward.code) : "",
          }));
          setWards(processedWards);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách xã:", error);
        }
      };
      fetchWards();
    }
  }, [selectedDistrictId]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      const userId = user.id;

      const wardCodePattern = /^[a-zA-Z0-9]{1,9}$/;
      console.log("Giá trị WardCode:", selectedWardCode);

      if (!/^\d{1,9}$/.test(selectedWardCode)) {
        alert("WardCode phải là một chuỗi chỉ chứa các chữ số từ 1 đến 9 ký tự.");
        return;
      }

      const addressData = {
        accountId: userId,
        address,
        wardCode: selectedWardCode,
        ward,
        districtId: selectedDistrictId,
        district,
        provinceId: selectedProvinceId,
        province,
        isDefault: isDefault,
      };

      try {
        const response = await createAddress(addressData);
        console.log("Địa chỉ đã được tạo:", response);
        onClose();
      } catch (error) {
        console.error("Lỗi khi tạo địa chỉ:", error.errors);
      }
    } else {
      console.log("Không tìm thấy dữ liệu người dùng trong localStorage");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] overflow-y-auto">
      <div className="bg-white p-8 rounded-lg w-[550px] h-auto my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#002278]">Địa chỉ mới</h2>
          <button onClick={onClose} className="p-2">
            <FontAwesomeIcon
              icon={faTimes}
              className="text-[#002278] text-lg"
            />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2 text-lg">
              Địa chỉ cụ thể
            </label>
            <textarea
              placeholder="  Địa chỉ cụ thể"
              className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm placeholder-gray-400"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2 text-lg">
              Tỉnh/Thành phố
            </label>
            <Select
              className="w-full h-[50px]"
              value={selectedProvinceId}
              onChange={(value) => setSelectedProvinceId(value)}
              placeholder="Chọn Tỉnh/Thành phố"
              showSearch
              optionFilterProp="children"
            >
              {provinces.map((province) => (
                <Option key={province.provinceID} value={province.provinceID}>
                  {province.provinceName}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2 text-lg">
              Quận/Huyện
            </label>
            <Select
              className="w-full h-[50px]"
              value={selectedDistrictId}
              onChange={(value) => setSelectedDistrictId(value)}
              placeholder="Chọn Quận/Huyện"
              showSearch
              optionFilterProp="children"
            >
              {districts.map((district) => (
                <Option key={district.districtID} value={district.districtID}>
                  {district.districtName}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2 text-lg">
              Phường/Xã
            </label>
            <Select
              className="w-full h-[50px]"
              value={selectedWardCode}
              onChange={(value) => {
                console.log("Selected Ward Code:", value);
                setSelectedWardCode(value);
              }}
              placeholder="Chọn Phường/Xã"
              showSearch
              optionFilterProp="children"
            >
              {wards.map((ward) => (
                <Option key={ward.wardCode} value={ward.wardCode}>
                  {ward.wardName}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Chọn mặc định
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`py-2 px-4 rounded ${
                  isDefault
                    ? "bg-[#002278] text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setIsDefault(true)}
              >
                Nhà Riêng
              </button>
              <button
                type="button"
                className={`py-2 px-4 rounded ${
                  !isDefault
                    ? "bg-[#002278] text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setIsDefault(false)}
              >
                Văn Phòng
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-200 text-black py-2 px-4 rounded mr-2"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-[#002278] text-white py-2 px-4 rounded"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddressPopup;
