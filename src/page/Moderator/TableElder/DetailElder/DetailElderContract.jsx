import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { weightRegex } from "../../../../regexPatterns";
import { getData } from "../../../../api/api";
import { Skeleton } from "antd";
import ErrorPage from "../../../404/ErrorPage";
import ComInput from "../../../../Components/ComInput/ComInput";
import ComTextArea from "../../../../Components/ComInput/ComTextArea";
import ComDatePicker from "../../../../Components/ComDatePicker/ComDatePicker";

export default function DetailElderContract() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setErrorApi] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    reloadData();
  }, [id]);
  console.log(data);

  const methods = useForm({
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
    <div className="col-span-3 2xl:col-span-3">
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm  sm:p-6  ">
        <h3 className="mb-4 text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
          Chi tiết hợp đồng đang được sử dụng
        </h3>
        {data.contractsInUse ? (
          <FormProvider {...methods}>
            <form
              // onSubmit={handleSubmit(onSubmit)}
              className="mx-auto mt-2  "
            >
              <div className=" p-2">
                <div
                  className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
                  // style={{ height: "65vh" }}
                >
                  <div className="sm:col-span-1">
                    <ComInput
                      type="text"
                      label="Hợp đồng số"
                      placeholder="Vui lòng nhập số hợp đồng"
                      readOnly
                      {...register("contractsInUse.name")}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <ComDatePicker
                      label="Ngày ký hợp đồng"
                      type="numbers"
                      name={"contractsInUse.signingDate"}
                      placeholder="Vui lòng nhập ngày ký hợp đồng"
                      open={false}
                      inputReadOnly
                      {...register("contractsInUse.signingDate")}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <ComDatePicker
                      label="Ngày bắt đầu hợp đồng"
                      placeholder="Vui lòng nhập ngày bắt đầu hợp đồng"
                      // disabled
                      open={false}
                      inputReadOnly
                      {...register("contractsInUse.startDate")}
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <ComDatePicker
                      label="Ngày kết thúc hợp đồng"
                      placeholder="Vui lòng nhập ngày kết thúc hợp đồng"
                      open={false}
                      inputReadOnly
                      {...register("contractsInUse.endDate")}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <ComTextArea
                      type="text"
                      label="Nội dung hợp đồng"
                      rows={5}
                      placeholder="Vui lòng nhập nội dung hợp đồng"
                      readOnly
                      {...register("contractsInUse.content")}
                      // required
                    />
                  </div>
                  {/* <div className="sm:col-span-2">
                    <ComInput
                      type="text"
                      label="URL hình ảnh"
                      placeholder="Vui lòng nhập URL hình ảnh"
                     readOnly 
                      {...register("contractsInUse.imageUrl")}
                      required
                    />
                  </div> */}

                  <div className="sm:col-span-2">
                    <ComTextArea
                      label="Ghi chú hợp đồng"
                      placeholder="Vui lòng nhập ghi chú"
                      rows={5}
                      readOnly
                      {...register("contractsInUse.notes")}
                      // required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <ComTextArea
                      label="Mô tả hợp đồng"
                      placeholder="Vui lòng nhập mô tả"
                      rows={5}
                      name="contractsInUse"
                      readOnly
                      {...register("contractsInUse.description")}
                      // required
                    />
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        ) : (
          <span className="font-medium">
            Hiện tại chưa có hợp đồng nào đang được sử dụng
          </span>
        )}
      </div>
    </div>
  );
}
