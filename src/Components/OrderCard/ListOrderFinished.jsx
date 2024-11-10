import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { getData } from "../../api/api";
import { useStorage } from "../../hooks/useLocalStorage";
import { Empty, Spin } from "antd";

export default function ListOrderFinished({ activeKey }) {
  const [data, setData] = useState([]);
  const [user, setUser] = useStorage("user", null);
  const [loading, setLoading] = useState(true);
  const reloadData = () => {
    getData(`/orders/accounts/${user.id}?status=finished&orderBy=CreateDateAsc`)
      .then((data) => {
        setData(data?.data.data);
        console.log(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setLoading(true);
    reloadData();
  }, [activeKey]);

  return (
    <div className="list-order-container">
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" tip="Đang tải đơn hàng..." />
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center">
          <Empty description="Không có đơn hàng nào" />
        </div>
      ) : (
        data.map((order, index) => (
          <div key={order.id || index} className="mt-4">
            <OrderCard order={order} reloadData={reloadData} />
          </div>
        ))
      )}
    </div>
  );
}
