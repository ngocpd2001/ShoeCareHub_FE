import React from "react";
import OrderCard from "../../Components/OrderCard/OrderCard";
import DetailOrderInformation from "./DetailOrderInformation";

export default function OrderHistory() {
  return (
    <div>
      <div className=" col-span-3  ">
        <div className="pb-4 mb-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1   sm:pt-1 sm:pb-6 sm:px-6  ">
          <DetailOrderInformation />
        </div>
      </div>
    </div>
  );
}
