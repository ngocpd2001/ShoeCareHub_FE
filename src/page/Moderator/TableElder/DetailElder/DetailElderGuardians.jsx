import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getData } from "../../../../api/api";
import { Skeleton } from "antd";
import ErrorPage from "../../../404/ErrorPage";
import { TableElderGuardians } from "./TableElderGuardians";
import { TableHealth } from "../../../Manager/Health/TableHealth";

export default function DetailElderGuardians() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setErrorApi] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    reloadData();
  }, [id]);
  console.log(data);

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
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1   sm:p-6  ">
        <h3 className="mb-4 text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
          Người giám hộ
        </h3>
        <TableElderGuardians idElder={id} />
      </div>
    </div>
  );
}
