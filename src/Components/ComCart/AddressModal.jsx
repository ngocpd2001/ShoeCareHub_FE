import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getAddressByAccountId } from "../../api/user";
import EditAddressPopup from "./EditAddressPopup";

const AddressModal = ({ isOpen, onClose, accountId, onSelectAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchAddresses = async () => {
        try {
          const fetchedAddresses = await getAddressByAccountId(accountId);
          setAddresses(fetchedAddresses);
          const defaultAddress = fetchedAddresses.find(
            (addr) => addr.isDefault
          );
          setSelectedAddress(defaultAddress);
        } catch (error) {
          console.error("Lỗi khi lấy địa chỉ:", error);
        }
      };
      fetchAddresses();
    }
  }, [isOpen, accountId]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleConfirm = () => {
    onSelectAddress(selectedAddress);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#002278]">Địa Chỉ Của Tôi</h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className="text-[#002278]" />
          </button>
        </div>
        <div>
          <button
            className="mt-1 mb-3 bg-gray-200 text-black py-2 px-4 rounded w-full flex items-center justify-center"
            onClick={() => setIsEditPopupOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm Địa Chỉ Mới
          </button>
          {addresses.map((address, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center py-2">
                <input
                  type="radio"
                  name="address"
                  className="mr-2"
                  checked={selectedAddress === address}
                  onChange={() => handleAddressSelect(address)}
                />
                <div>
                  <p className="font-semibold">{address.address}</p>
                  <p>{`${address.ward}, ${address.province}, ${address.city}`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-200 text-black py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-[#002278] text-white py-2 px-4 rounded"
            onClick={handleConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
      {isEditPopupOpen && (
        <EditAddressPopup onClose={() => setIsEditPopupOpen(false)} />
      )}
    </div>
  );
};

export default AddressModal;
