import React from "react";
import ComPhoneConverter from "./../../../Components/ComPhoneConverter/ComPhoneConverter";
import ComCccdOrCmndConverter from "../../../Components/ComCccdOrCmndConverter/ComCccdOrCmndConverter";
import { Image } from "antd";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
import ComButton from "./../../../Components/ComButton/ComButton";
import ComGenderConverter from "../../../Components/ComGenderConverter/ComGenderConverter";

export default function DetailUser({ selectedUser, isOpenEdit, onClose }) {
  return (
    <div>
      <div className="p-4 bg-white ">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Chi tiết người dùng
        </h2>
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium ">
                Hình ảnh:
              </td>
              <td className="px-4 py-2">
                {selectedUser?.avatarUrl ? (
                  <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                    <Image
                      wrapperClassName=" w-full h-full object-cover object-center flex items-center justify-center "
                      src={selectedUser?.avatarUrl}
                      alt={selectedUser?.avatarUrl}
                      preview={{ mask: "Xem ảnh" }}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">
                Họ và tên:
              </td>
              <td className="px-4 py-2">{selectedUser?.fullName}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">
                Giới tính:
              </td>
              <td className="px-4 py-2">
                <ComGenderConverter>{selectedUser?.gender}</ComGenderConverter>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">
                Số điện thoại:
              </td>
              <td className="px-4 py-2">
                <ComPhoneConverter>
                  {selectedUser?.phoneNumber}
                </ComPhoneConverter>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">
                CMND/CCCD:
              </td>
              <td className="px-4 py-2">
                <ComCccdOrCmndConverter>
                  {selectedUser?.cccd}
                </ComCccdOrCmndConverter>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">
                Ngày sinh:
              </td>
              <td className="px-4 py-2">
                <ComDateConverter>{selectedUser?.dateOfBirth}</ComDateConverter>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">Địa chỉ:</td>
              <td className="px-4 py-2">{selectedUser?.address}</td>
            </tr>
            {/* Thêm các dòng khác cho thông tin chi tiết */}
          </tbody>
        </table>
        {isOpenEdit ? (
          <div className="mt-10">
            <ComButton
              onClick={() => {
                onClose();
                isOpenEdit();
              }}
              type="primary"
              className="block w-full rounded-md bg-[#0F296D]  text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0F296D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Cập nhật
            </ComButton>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
