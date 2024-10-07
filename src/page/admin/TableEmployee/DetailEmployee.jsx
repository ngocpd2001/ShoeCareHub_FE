import React, { useEffect, useState } from "react";
import ComPhoneConverter from "./../../../Components/ComPhoneConverter/ComPhoneConverter";
import ComCccdOrCmndConverter from "../../../Components/ComCccdOrCmndConverter/ComCccdOrCmndConverter";
import { Image } from "antd";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
import ComGenderConverter from "./../../../Components/ComGenderConverter/ComGenderConverter";
import ComRoleConverter from "../../../Components/ComRoleConverter/ComRoleConverter";
import { getData } from "../../../api/api";
import ComButton from "../../../Components/ComButton/ComButton";

export default function DetailEmployee({ selectedData, isOpenEdit, onClose }) {
  const [data, setData] = useState({});
  console.log(data);
  useEffect(() => {
    // setData(selectedData);

    getData(`/users/${selectedData?.id}`)
      .then((e) => {
        setData(e?.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, [selectedData]);
  return (
    <div>
      <div className="p-4 bg-white ">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Chi tiết nhân viên
        </h2>
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium ">
                Hình ảnh:
              </td>
              <td className="px-4 py-2">
                {data?.avatarUrl ? (
                  <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                    <Image
                      wrapperClassName=" w-full h-full object-cover object-center flex items-center justify-center "
                      src={data?.avatarUrl}
                      alt={data?.avatarUrl}
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
              <td className="px-4 py-2">{data?.fullName}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">
                Giới tính:
              </td>
              <td className="px-4 py-2">
                <ComGenderConverter>{data?.gender}</ComGenderConverter>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">Chức vụ:</td>
              <td className="px-4 py-2">
                <ComRoleConverter>
                  {data?.roles ? data?.roles[0]?.name : ""}
                </ComRoleConverter>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">
                Số điện thoại:
              </td>
              <td className="px-4 py-2">
                <ComPhoneConverter>{data?.phoneNumber}</ComPhoneConverter>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">
                CMND/CCCD:
              </td>
              <td className="px-4 py-2">
                <ComCccdOrCmndConverter>{data?.cccd}</ComCccdOrCmndConverter>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">
                Ngày sinh:
              </td>
              <td className="px-4 py-2">
                <ComDateConverter>{data?.dateOfBirth}</ComDateConverter>
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-600 font-medium">Gmail:</td>
              <td className="px-4 py-2">{data?.email}</td>
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
          <p></p>
        )}
      </div>
    </div>
  );
}
