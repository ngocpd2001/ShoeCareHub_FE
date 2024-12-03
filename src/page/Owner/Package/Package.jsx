// Package.js
import React, { useEffect, useState } from "react";
import { getData } from "../../../api/api";
import InvoiceDisplay from "./InvoiceDisplay";
import { TablePackage } from "./TablePackage";

const Package = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    getData(`/platform-packs/register-packs`)
      .then((e) => {
        // Giả sử dữ liệu trả về nằm trong e.data.data
        setPackages(e?.data.data);
        console.log("Dữ liệu gói:", e?.data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
  }, []);

  const handleSubscribeClick = (plan) => {
    setSelectedPackage(plan);
    setShowInvoice(true);
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    setSelectedPackage(null);
  };

  return (
    <div className="container mx-auto p-6 my-3">
      <h1 className="text-3xl font-bold text-center mb-7 text-[#1C3A9C]">
        Gói Đăng Ký Nhà Cung Cấp
      </h1>
      <div className="flex justify-center space-x-5">
        {packages.map((plan) => (
          <div
            key={plan.id}
            className="bg-white shadow-md rounded-lg p-6 w-80 flex flex-col border-2 border-[#3A4980]"
          >
            <h2 className="text-2xl font-semibold mb-2 text-center">
              {plan.name}
            </h2>
            <p className="text-xl mt-2 mb-1 text-center">
              {plan.price.toLocaleString()} VND
            </p>
            <p className="text-lg text-gray-500 text-center mb-4">
              {plan.period} tháng
            </p>
            <p className="text-lg text-gray-500 text-center mb-4">
              {plan.description}
            </p>
            <button
              className="mt-auto bg-[#1C3A9C] text-white py-2 px-4 rounded text-lg"
              onClick={() => handleSubscribeClick(plan)}
            >
              ĐĂNG KÝ
            </button>
          </div>
        ))}
      </div>

      {showInvoice && selectedPackage && (
        <InvoiceDisplay
          packageInfo={selectedPackage}
          onClose={handleCloseInvoice}
        />
      )}

      <div className="mt-4">
        <TablePackage />
      </div>
    </div>
  );
};

export default Package;
