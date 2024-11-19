import React, { useEffect, useState } from "react";
import { getData } from "../../../api/api";
import ComTypePackageConverter from "../../../Components/ComTypePackageConverter/ComTypePackageConverter";

export default function TopServicePackage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getData("/service-package?State=Active&SortDir=Desc")
      .then((e) => {
        const sortedData = e?.data?.contends?.sort(
          (a, b) => b.totalOrder - a.totalOrder
        );
        setData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);
  function formatCurrency(number) {
    // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
    if (typeof number === "number") {
      return number.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    }
  }
  return (
    <div className="grid grid-cols-1 mt-10 gap-4 md:gap-6 2xl:gap-7.5 mb-6">
      <div className="p-4 bg-white rounded-lg  shadow-lg">
        <h2 className="text-xl font-bold">
          Những dịch vụ được sử dụng nhiều nhất
        </h2>
        <table className="w-full mt-4">
          <thead className="bg-[#efefef] ">
            <tr>
              <th className="text-left p-2">Tên dịch vụ</th>
              <th className="text-center p-2">Số lượng sử dụng</th>
              <th className="text-center p-2">Giá tiền</th>
              <th className="text-center p-2">Dạng dịch vụ</th>
              <th className="text-center p-2">Thể loại </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, index) => (
                <>
                  {index <= 4 && (
                    <tr key={index} className="border-b-2 border-x-stone-500">
                      <td className="py-2">
                        <div className="flex items-center">
                          <img
                            src={item.imageUrl} // Assuming there's a logoUrl in your data
                            alt={item.source}
                            className="w-10 h-10 mr-2"
                          />
                          {item.name}
                        </div>
                      </td>
                      <td className="text-center px-4">{item.totalOrder}</td>
                      <td className="text-center px-4 text-green-500 font-bold">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="text-center px-4">
                        <ComTypePackageConverter>
                          {item.type}
                        </ComTypePackageConverter>
                      </td>
                      <td className="text-center px-4 text-blue-500">
                        {item?.servicePackageCategory?.name}
                      </td>
                    </tr>
                  )}
                </>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
