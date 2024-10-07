import React from "react";
import { Tabs } from "antd";
import DetailElderContract from "./DetailElderContract";
import DetailElderHealth from "./DetailElderHealth";
import DetailElderContractList from "./DetailElderContractList";
import DetailElderHealthList from "./DetailElderHealthList";
import DetailElderGuardians from "./DetailElderGuardians";
import DetailElderDisease from "./DetailElderDisease";

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: "Thông tin sức khỏe",
    children: <DetailElderHealth />,
  },
  {
    key: "2",
    label: "Danh sách bệnh người cao tuổi",
    children: <DetailElderDisease />,
  },
  {
    key: "3",
    label: "Danh sách người giám hộ",
    children: <DetailElderGuardians />,
  },
  {
    key: "4",
    label: "Hợp đồng đang được sử dụng",
    children: <DetailElderContract />,
  },
  {
    key: "5",
    label: "Danh sách hợp đồng",
    children: <DetailElderContractList />,
  },
  {
    key: "7",
    label: "Danh sách chỉ số đo",
    children: <DetailElderHealthList />,
  },
];
const DetailElderInformation = () => (
  <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
);
export default DetailElderInformation;
