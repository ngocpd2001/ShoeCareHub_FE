import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { getData } from "../../api/api";
import { useStorage } from "../../hooks/useLocalStorage";
import { Empty, Spin } from "antd";

export default function ListOrderPending({ activeKey }) {
  const [data, setData] = useState([]);
  const [user, setUser] = useStorage("user", null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        setLoading(true);
        getData(
          `/orders/accounts/${user.id}?status=pending&orderBy=CreateDateAsc`
        )
          .then((data) => {
            setData(data?.data.data);
            // console.log(data.data.data);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
    console.log('====================================');
    console.log(123);
    console.log('====================================');
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
            <OrderCard order={order} />
          </div>
        ))
      )}
    </div>
  );
}
