import { Steps } from 'antd';
import React, { useEffect, useState } from 'react'
import { getData } from '../../api/api';

export default function StepsDetail({ orderCode }) {
  console.log(orderCode);
  const [data,setData]=useState({})
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (orderCode) {
      getData(`/order-ship/status?orderCode=${orderCode}`)
        .then((data) => {
          console.log(11111222, data.data.data);
          setData(data.data.data);
          switch (data?.data?.data?.status) {
            case "picking":
              setCurrent(0);
              break;
            case "picked":
              setCurrent(1);
              break;
            case "delivering":
              setCurrent(2);
              break;
            case "ready_to_pick":
              setCurrent(0);
              break;

            default:
              break;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [orderCode]);

  return (
    <div>
      <p className="text-2xl p-4">Trạng thái vận chuyển</p>
     {orderCode&& <Steps
        current={current}
        items={[
          {
            title: "Đang lấy hàng",
            // description,
          },
          {
            title: "Đã lấy hàng",
            // description,
          },
          {
            title: "Đang giao hàng",
            // description,
          },
        ]}
      />}
    </div>
  );
}
