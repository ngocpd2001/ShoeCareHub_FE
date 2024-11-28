import { Steps } from "antd";
import React, { useEffect, useState } from "react";
import { getData } from "../../api/api";

export default function StepsDetailProcess({ orderCode }) {
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    console.log(123213, orderCode);
    getData(
      `/processes/by-service/${orderCode?.service?.id}?pageIndex=1&pageSize=9999`
    )
      .then((data) => {
        console.log(11111222, data.data);
        console.log(orderCode.processState);

        // Sắp xếp theo processOrder tăng dần
        const sortedData = data.data.data.items.sort(
          (a, b) => a.processOrder - b.processOrder
        );
        // Thêm trường title = process
        const transformedData = sortedData.map((item) => ({
          ...item,
          title: item.process,
        }));
        const currentStepIndex = transformedData.findIndex(
          (step) => step.process === orderCode.processState
        );
        if (currentStepIndex !== -1) {
          setCurrent(currentStepIndex); // Cập nhật vị trí của bước hiện tại
        } else {
          setCurrent(0); // Nếu không tìm thấy, mặc định là bước đầu tiên
        }
        setData(transformedData);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [orderCode]);

  return (
    <div>
      <p className="text-2xl p-4">Trạng thái đơn hàng</p>
      {orderCode && <Steps current={current} items={data} />}
    </div>
  );
}
