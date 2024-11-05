import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AddressModal = ({ isOpen, onClose, addresses }) => {
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
          {addresses.map((address, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center">
                <input type="radio" name="address" className="mr-2" />
                <div>
                  <p className="font-semibold">{address.name}</p>
                  <p>{address.details}</p>
                </div>
              </div>
              <button className="text-[#002278] mt-2">Cập nhật</button>
            </div>
          ))}
        </div>
        <button className="mt-4 bg-[#002278] text-white py-2 px-4 rounded" onClick={onClose}>
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default AddressModal;
