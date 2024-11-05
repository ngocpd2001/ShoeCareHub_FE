import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { createAddress } from "../../api/user";

const EditAddressPopup = ({ onClose }) => {
  const [isDefault, setIsDefault] = useState(false);
  const [address, setAddress] = useState("");
  const [ward, setWard] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addressData = {
      address,
      ward,
      province,
      city,
      isDefault,
    };
    try {
      const response = await createAddress(addressData);
      console.log("Địa chỉ đã được tạo:", response);
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo địa chỉ:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#002278]">
            Địa chỉ mới
          </h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className="text-[#002278]" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Địa chỉ cụ thể
            </label>
            <textarea
              placeholder=""
              className="mt-1 block w-full border-2 border-gray-400 rounded-md shadow-sm"
              value={ward}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Phường\Xã
            </label>
            <textarea
              placeholder=""
              className="mt-1 block w-full border-2 border-gray-400 rounded-md shadow-sm"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Quận\Tỉnh
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-2 border-gray-400 rounded-md shadow-sm h-10"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Thành phố
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-2 border-gray-400 rounded-md shadow-sm h-10"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Chọn mặc định
              </label>
              <div className="flex space-x-2 mt-1">
                <button
                  type="button"
                  className={`py-2 px-4 border rounded min-w-[130px] ${
                    isDefault
                      ? "bg-[#13368e] text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => setIsDefault(true)}
                >
                  Nhà Riêng
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 border rounded min-w-[130px] ${
                    !isDefault
                      ? "bg-[#13368e] text-white"
                      : "bg-white text-gray-700"
                  }`}
                  onClick={() => setIsDefault(false)}
                >
                  Văn Phòng
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
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
