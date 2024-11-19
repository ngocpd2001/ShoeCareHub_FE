/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
import { getData } from "../../../api/api";
import { useParams } from "react-router-dom";
import ComGenderConverter from "../../../Components/ComGenderConverter/ComGenderConverter";
import ComCccdOrCmndConverter from "../../../Components/ComCccdOrCmndConverter/ComCccdOrCmndConverter";
import {  useForm } from "react-hook-form";
import * as yup from "yup";
import { weightRegex } from "../../../regexPatterns";
import { yupResolver } from "@hookform/resolvers/yup";
import { Skeleton } from "antd";
import ErrorPage from "../../404/ErrorPage";
import ComPhoneConverter from "../../../Components/ComPhoneConverter/ComPhoneConverter";
import DetailElderInformation from "./DetailElder/DetailElderInformation";
import ComAgeConverter from './../../../Components/ComDateConverter/ComAgeConverter';

export default function DetailElderPage() {
  const { id } = useParams();
  const CreateProductMessenger = yup.object({
    medicalRecord: yup.object({
      bloodType: yup.string().required("Vui lòng nhập nhóm máu"),
      weight: yup
        .string()
        .typeError("Vui lòng nhập cân nặng")
        .required("Vui lòng nhập cân nặng")
        .matches(weightRegex, "Cân nặng phải là số")
        .test(
          "min",
          "Cân nặng phải lớn hơn hoặc bằng 0",
          (value) => parseFloat(value) >= 0
        )
        .test(
          "max",
          "Cân nặng phải nhỏ hơn hoặc bằng 220",
          (value) => parseFloat(value) <= 220
        ),
      height: yup
        .string()
        .typeError("Vui lòng nhập chiều cao")
        .required("Vui lòng nhập chiều cao")
        .test(
          "min",
          "Chiều cao phải lớn hơn hoặc bằng 0 cm",
          (value) => parseFloat(value) >= 0
        )
        .test(
          "max",
          "Chiều cao phải nhỏ hơn hoặc bằng 200 cm",
          (value) => parseFloat(value) <= 200
        ),
      underlyingDisease: yup.string().required("Vui lòng nhập đủ bệnh lý"),
      note: yup.string().required("Vui lòng nhập ghi chú"),
    }),
    // trường hợp đồng
    contractsInUse: yup.object({
      name: yup.string().required("Vui lòng nhập số hợp đồng"),
      signingDate: yup.string().required("Vui lòng nhập ngày ký hợp đồng"),
      startDate: yup.string().required("Vui lòng nhập ngày bắt đầu hợp đồng"),
      endDate: yup.string().required("Vui lòng nhập ngày kết thúc hợp đồng"),
      content: yup.string().required("Vui lòng nhập nội dung hợp đồng"),
      // imageUrl: yup
      //   .string()
      //   .url("Vui lòng nhập URL hợp lệ")
      //   .required("Vui lòng nhập URL hình ảnh"),
      notes: yup.string().required("Vui lòng nhập ghi chú"),
      description: yup.string().required("Vui lòng nhập mô tả"),
    }),
  });
  const [loading, setLoading] = useState(true);
  const [error, setErrorApi] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    reloadData();
  }, [id]);
  console.log(data);

  const methods = useForm({
    resolver: yupResolver(CreateProductMessenger),
    values: data,
  });
  const { handleSubmit, register, setFocus, watch, setValue, setError } =
    methods;
  const reloadData = () => {
    getData(`/elders/${id}`)
      .then((e) => {
        setData(e?.data);
      })
      .catch((error) => {
        setErrorApi(true);
        console.error("Error fetching items:", error);
      })
      .finally(() => {
        setLoading(false);
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
            <h3 class="mb-1 text-xl font-bold text-gray-900  ">
              Thông tin người cao tuổi
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 col-span-3 2xl:col-span-3 gap-4">
          <div class="col-span-2 p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:col-span-1   sm:p-3 ">
            <div class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              <img
                class="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 object-cover"
                src={data?.imageUrl}
                alt={data?.name}
              />

              <div>
                <h3 class="mb-1 text-xl font-bold text-gray-900  ">
                  Người cao tuổi: {data?.name}
                </h3>
                <div class="text-sm text-gray-500  ">
                  Năm sinh:{" "}
                  <ComDateConverter>{data?.dateOfBirth}</ComDateConverter>
                </div>
                <div class="text-sm text-gray-500  ">
                  Tuổi: <ComAgeConverter>{data?.dateOfBirth}</ComAgeConverter>
                </div>
                <div class="text-sm text-gray-500  ">
                  Giới tính:{" "}
                  <ComGenderConverter>{data?.gender}</ComGenderConverter>
                </div>
                <div class="text-sm text-gray-500  ">
                  CMND/CCCD:{" "}
                  <ComCccdOrCmndConverter>{data?.cccd}</ComCccdOrCmndConverter>
                </div>
                <div class="text-sm text-gray-500  ">
                  Phòng: {data?.room?.name||"Không có"}
                </div>
                <div class="mb-4 text-sm text-gray-500  ">
                  Gói dưỡng lão: {data?.contractsInUse?.nursingPackage?.name}
                </div>
              </div>
            </div>
          </div>

          <div class=" col-span-2 p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:col-span-1   sm:p-3  ">
            <div class="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              <img
                class="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 object-cover"
                src={data?.user?.avatarUrl}
                alt={data?.user?.fullName}
              />

              <div>
                <h3 class="mb-1 text-xl font-bold text-gray-900  ">
                  Người giám hộ chính: {data?.user?.fullName}
                </h3>
                <div class="text-sm text-gray-500  ">
                  Tuổi:{" "}
                  <ComAgeConverter>{data?.user?.dateOfBirth}</ComAgeConverter>
                </div>
                <div class="text-sm text-gray-500  ">
                  Năm sinh:{" "}
                  <ComDateConverter>{data?.user?.dateOfBirth}</ComDateConverter>
                </div>
                <div class="text-sm text-gray-500  ">
                  Giới tính:{" "}
                  <ComGenderConverter>{data?.user?.gender}</ComGenderConverter>
                </div>

                <div class="text-sm text-gray-500  ">
                  Số điện thoại:{" "}
                  <ComPhoneConverter>
                    {data?.user?.phoneNumber}
                  </ComPhoneConverter>
                </div>
                <div class="text-sm text-gray-500  ">
                  Mối quan hệ: {data?.relationship}
                </div>

                <div class="mb-4 text-sm text-gray-500  ">
                  Gmail: {data?.user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" col-span-3  ">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1   sm:p-6  ">
            <DetailElderInformation />
          </div>
        </div>
      </div>
    </>
  );
}
