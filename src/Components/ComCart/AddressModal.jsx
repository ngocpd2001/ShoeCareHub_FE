import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getAddressByAccountId } from "../../api/address";
import EditAddressPopup from "./EditAddressPopup";

const AddressModal = ({ isOpen, onClose, accountId, onSelectAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

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

  useEffect(() => {
    if (isOpen && accountId) {
      fetchAddresses();
    }
  }, [isOpen, accountId]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      if (!isEditPopupOpen) {
        document.body.classList.remove('overflow-hidden');
      }
    }
    
    return () => {
      if (!isOpen && !isEditPopupOpen) {
        document.body.classList.remove('overflow-hidden');
      }
    };
  }, [isOpen, isEditPopupOpen]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleConfirm = () => {
    onSelectAddress(selectedAddress);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-[32rem] relative z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#002278]">Địa Chỉ Của Tôi</h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className="text-[#002278]" />
          </button>
        </div>
        <div>
          <button
            className="mt-2 mb-2 bg-gray-200 text-black py-3 px-5 rounded w-full flex items-center justify-center"
            onClick={() => setIsEditPopupOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm Địa Chỉ Mới
          </button>
          {addresses.map((address, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-center py-3">
                <input
                  type="radio"
                  name="address"
                  className="mr-3"
                  checked={selectedAddress === address}
                  onChange={() => handleAddressSelect(address)}
                />
                <div>
                  <p className="font-semibold text-lg">{address.address}</p>
                  <p className="text-lg">{`${address.ward}, ${address.district}, ${address.province}`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <button
            className="bg-gray-200 text-black py-3 px-5 rounded mr-3"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-[#002278] text-white py-3 px-5 rounded"
            onClick={handleConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
      {isEditPopupOpen && (
        <EditAddressPopup 
          onClose={() => {
            setIsEditPopupOpen(false);
            fetchAddresses();
          }} 
          className="z-[60]"
        />
      )}
    </div>
  );
};

export default AddressModal;
