import React, { useState } from "react";
import { Tabs } from "antd";
import ListOrder from "../../Components/OrderCard/ListOrder";
import ListOrderFinished from "../../Components/OrderCard/ListOrderFinished";
import ListOrderStorage from "./../../Components/OrderCard/ListOrderStorage";
import ListOrderPending from "../../Components/OrderCard/ListOrderPending";
import ListOrderAbandoned from "../../Components/OrderCard/ListOrderAbandoned";
import ListOrderCanceled from "../../Components/OrderCard/ListOrderCanceled";
import ListOrderShipping from "../../Components/OrderCard/ListOrderShipping";
import ListOrderProcessing from "../../Components/OrderCard/ListOrderProcessing";

const DetailOrderInformation = () => {
  const [activeKey, setActiveKey] = useState("1");
  const onChange = (key) => {
    console.log(key);
    setActiveKey(key);
  };
  const items = [
    {
      key: "1",
      label: "Tất cả",
      children: <ListOrder activeKey={activeKey} />,
    },
    {
      key: "7",
      label: "Đang chờ ",
      children: <ListOrderPending activeKey={activeKey} />,
    },
    {
      key: "2",
      label: "Đang xử lý",
      children: <ListOrderProcessing activeKey={activeKey} />,
    },

    {
      key: "4",
      label: "Chờ nhận hàng",
      children: <ListOrderStorage activeKey={activeKey} />,
    },
    {
      key: "5",
      label: "Vận chuyển",
      children: <ListOrderShipping activeKey={activeKey} />,
    },
    {
      key: "3",
      label: "Hoàn thành",
      children: <ListOrderFinished activeKey={activeKey} />,
    },
    {
      key: "6",
      label: "Đã huỷ",
      children: <ListOrderCanceled activeKey={activeKey} />,
    },
    {
      key: "8",
      label: "Quá hạn ",
      children: <ListOrderAbandoned activeKey={activeKey} />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};
export default DetailOrderInformation;
