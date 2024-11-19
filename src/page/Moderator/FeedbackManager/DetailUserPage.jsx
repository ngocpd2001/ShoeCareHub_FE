/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
import { getData } from "../../../api/api";
import { useHref, useParams } from "react-router-dom";
import ComGenderConverter from "../../../Components/ComGenderConverter/ComGenderConverter";
import ComCccdOrCmndConverter from "../../../Components/ComCccdOrCmndConverter/ComCccdOrCmndConverter";
import { FormProvider, useForm } from "react-hook-form";
import ComInput from "../../../Components/ComInput/ComInput";
import ComDatePicker from "../../../Components/ComDatePicker/ComDatePicker";
import * as yup from "yup";
import { weightRegex } from "../../../regexPatterns";
import { yupResolver } from "@hookform/resolvers/yup";
import ComTextArea from "../../../Components/ComInput/ComTextArea";

import { Image, Skeleton } from "antd";
import ErrorPage from "../../404/ErrorPage";
import TableContract from "./TableContract";
import ComPhoneConverter from "../../../Components/ComPhoneConverter/ComPhoneConverter";
import { TableHealth } from "../../Manager/Health/TableHealth";
import { Tables } from "../TableElder/Tables";

export default function DetailUserPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setErrorApi] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    reloadData();
  }, [id]);
  console.log(id);

  const reloadData = () => {
    getData(`/users/${id}`)
      .then((e) => {
        setData(e?.data);
        console.log(e.data);
      })
      .catch((error) => {
        setErrorApi(true);
        console.error("Error fetching items:", error);
      })
      .finally(() => {
        setLoading(false);
        console.error("Error fetching items:", 111);
      });
  };

  if (loading) {
    return <Skeleton active />;
  }
  if (error) {
    return <ErrorPage statusCode={"404"} />;
  }
  return (
    <>
      <div className="grid px-4 pt-6 grid-cols-3 xl:gap-4  ">
        <div className=" col-span-3  ">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1   sm:p-6  ">
            <h3 class="mb-1 text-xl font-bold text-gray-900   p-3">
              Thông tin người dùng
            </h3>
            <div class=" gap-4  flex max-sm:flex-col items-start">
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
                      <ComCccdOrCmndConverter>
                        {data?.cccd}
                      </ComCccdOrCmndConverter>
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
                    <td className="px-4 py-2 text-gray-600 font-medium">
                      Địa chỉ:
                    </td>
                    <td className="px-4 py-2">{data?.address}</td>
                  </tr>
                  {/* Thêm các dòng khác cho thông tin chi tiết */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className=" col-span-3  ">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1   sm:p-6  ">
            <h3 class="mb-1 text-xl font-bold text-gray-900   p-3">
              Danh sách hợp đồng
            </h3>
            <TableContract idUser={id} />
          </div>
        </div>
        <div className=" col-span-3  ">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1   sm:p-6  ">
            <h3 class="mb-1 text-xl font-bold text-gray-900   p-3">
              Danh sách người cao tuổi 
            </h3>
            <Tables idUser={id} />
          </div>
        </div>
      </div>
    </>
  );
}
