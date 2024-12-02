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
import ListOrderApproved from "../../Components/OrderCard/ListOrderApproved";
import ListOrderReceived from "../../Components/OrderCard/ListOrderReceived";
import ListOrderDelivered from "../../Components/OrderCard/ListOrderDelivered";

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
      key: "2",
      label: "Đã huỷ",
      children: <ListOrderCanceled activeKey={activeKey} />,
    },
    {
      key: "3",
      label: "Đang chờ ",
      children: <ListOrderPending activeKey={activeKey} />,
    },
    {
      key: "4",
      label: "Đã xác nhận",
      children: <ListOrderApproved activeKey={activeKey} />,
    },
    {
      key: "5",
      label: "Đã nhận",
      children: <ListOrderReceived activeKey={activeKey} />,
    },
    {
      key: "6",
      label: "Đang xử lý",
      children: <ListOrderProcessing activeKey={activeKey} />,
    },

    {
      key: "7",
      label: "Chờ nhận hàng",
      children: <ListOrderStorage activeKey={activeKey} />,
    },
    {
      key: "8",
      label: "Đang vận chuyển",
      children: <ListOrderShipping activeKey={activeKey} />,
    },
    {
      key: "9",
      label: "Đã vận chuyển",
      children: <ListOrderDelivered activeKey={activeKey} />,
    },
    {
      key: "10",
      label: "Hoàn thành",
      children: <ListOrderFinished activeKey={activeKey} />,
    },

    {
      key: "11",
      label: "Quá hạn ",
      children: <ListOrderAbandoned activeKey={activeKey} />,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};
export default DetailOrderInformation;
