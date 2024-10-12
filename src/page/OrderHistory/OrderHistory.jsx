import React from 'react'
import OrderCard from '../../Components/OrderCard/OrderCard'
import TabsOrderHistory from './DetailElderInformation';

export default function OrderHistory() {
  return (
    <div>
      <div className=" col-span-3  ">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1   sm:p-6  ">
          <TabsOrderHistory />
        </div>
      </div>
  
    </div>
  );
}
