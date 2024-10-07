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
import ComModal from "../../../../Components/ComModal/ComModal";
import EditHealth from "./EditHealth";
import { useModalState } from "../../../../hooks/useModalState";
import ComMenuButonTable from "../../../../Components/ComMenuButonTable/ComMenuButonTable";

export default function DetailElderHealth() {
  const { id } = useParams();
  const modal = useModalState();

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
    <div className=" col-span-3  ">
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm    sm:p-6  ">
        <h3 className="flex justify-between mb-4 text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
          <> Thông tin sức khỏe</>
          <ComMenuButonTable
            // record={record}
            // showModalDetails={() => showModal(record)}
            showModalEdit={() => modal?.handleOpen()}
            excludeDefaultItems={["delete", "details"]}
          />
        </h3>
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
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComInput
                      type="text"
                      label={"Nhóm máu"}
                      showSearch
                      // placeholder={"Vui lòng nhập Nhóm máu"}
                      readOnly
                      {...register("medicalRecord.bloodType")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComInput
                      type="numberFloat"
                      label={"Cân nặng(KG)"}
                      // placeholder={"Vui lòng nhập Cân nặng"}
                      readOnly
                      {...register("medicalRecord.weight")}
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <div className="mt-2.5">
                    <ComInput
                      type="numberFloat"
                      label={"Chiều cao(Cm)"}
                      // placeholder={"Vui lòng nhập Chiều cao"}
                      readOnly
                      {...register("medicalRecord.height")}
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComTextArea
                      type="text"
                      label={"Bệnh lý trước đó"}
                      // placeholder={"Vui lòng nhập Bệnh lý"}
                      rows={5}
                      readOnly
                      {...register("medicalRecord.underlyingDisease")}
                      // required
                    />
                  </div>
                </div>
                {/* <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComTextArea
                      type="text"
                      label={"Thói quen sinh hoạt"}
                      // placeholder={"Vui lòng nhập Ghi chú"}
                      rows={5}
                      readOnly
                      {...register("habits")}
                      // required
                    />
                  </div>
                </div> */}
                <div className="sm:col-span-2">
                  <div className="mt-2.5">
                    <ComTextArea
                      type="text"
                      label={"Ghi chú"}
                      // placeholder={"Vui lòng nhập Ghi chú"}
                      rows={5}
                      readOnly
                      {...register("medicalRecord.note")}
                      // required
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      <ComModal
        isOpen={modal?.isModalOpen}
        onClose={modal?.handleClose}
        width={800}
      >
        <EditHealth
          selectedData={data?.medicalRecord}
          onClose={modal?.handleClose}
          tableRef={reloadData}
        />
      </ComModal>
    </div>
  );
}
