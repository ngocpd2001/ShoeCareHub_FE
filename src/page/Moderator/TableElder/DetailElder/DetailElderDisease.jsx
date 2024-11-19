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
import ComMenuButonTable from "../../../../Components/ComMenuButonTable/ComMenuButonTable";
import { useModalState } from "../../../../hooks/useModalState";
import ComModal from "../../../../Components/ComModal/ComModal";
import EditDisease from "./EditDisease";

export default function DetailElderDisease() {
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
    <div className="col-span-3">
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-lg sm:p-6">
        <h3 className="flex justify-between mb-4 text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
          <> Các loại bệnh đang mắc phải</>
          <ComMenuButonTable
            // record={record}
            // showModalDetails={() => showModal(record)}
            showModalEdit={() => modal?.handleOpen()}
            excludeDefaultItems={["delete", "details"]}
          />
        </h3>

        <ul className="list-disc pl-6 space-y-2">
          {data?.medicalRecord?.diseaseCategories.map((data, index) => (
            <li key={index} className="text-gray-700">
              <span className="font-medium">Bệnh {index + 1}:</span> {data.name}
            </li>
          ))}

          {data?.medicalRecord?.diseaseCategories?.length===0 && (
            <span className="font-medium">
              Hiện người cao tuổi chưa mắc bệnh nào
            </span>
          )}
        </ul>
      </div>
      <ComModal
        isOpen={modal?.isModalOpen}
        onClose={modal?.handleClose}
        width={800}
      >
        <EditDisease
          selectedData={data?.medicalRecord}
          onClose={modal?.handleClose}
          tableRef={reloadData}
        />
      </ComModal>
    </div>
  );
}
