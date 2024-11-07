import React from "react";
import { Tabs } from "antd";
import ListOrder from "../../Components/OrderCard/ListOrder";

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: "Tất cả",
    children: <ListOrder />,
  },
  {
    key: "2",
    label: "Đã giao",
    children: <ListOrder />,
  },
  {
    key: "3",
    label: "Hoàn thành",
    children: <ListOrder />,
  },
  {
    key: "4",
    label: "Lưu kho",
    children: <ListOrder />,
  },
  {
    key: "5",
    label: "Vận chuyển",
    children: <ListOrder />,
  },
  {
    key: "6",
    label: "Đã huỷ",
    children: <ListOrder />,
  },
  {
    key: "7",
    label: "Hoàn tiền",
    children: <ListOrder />,
  },
];
const DetailOrderInformation = () => (
  <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
);
export default DetailOrderInformation;
