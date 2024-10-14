import React from 'react';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';  

const Subscription = () => {  
  const SubscriptionData = [  
    {  
      id: 1,  
      name: "Gói 01 Tháng",  
      price: "999.999đ",  
      month: "1 tháng",  
    },  
    {  
      id: 2,  
      name: "Gói 06 Tháng",  
      price: "9.999.999đ",  
      month: "6 tháng",  
    },  
    {  
      id: 3,  
      name: "Gói 12 Tháng",  
      price: "99.999.999đ",  
      month: "12 tháng",  
    },  
  ];  

  return (  
    <div className="container mx-auto p-6 my-3">  
      <h1 className="text-3xl font-bold text-center mb-7 text-[#1C3A9C]">Gói Đăng Ký Nhà Cung Cấp</h1>  
      <div className="flex justify-center space-x-5">  
        {SubscriptionData.map((plan) => (  
          <div key={plan.id} className="bg-white shadow-md rounded-lg p-6 w-80 flex flex-col border-2 border-[#3A4980]">  
            <h2 className="text-2xl font-semibold mb-2 text-center">{plan.name}</h2>  
            <p className="text-xl mt-2 mb-1 text-center">{plan.price}</p>  
            <p className="text-lg text-gray-500 text-center mb-4">{plan.month}</p>  
            <button className="mt-auto bg-[#1C3A9C] text-white py-2 px-4 rounded text-lg">  
              ĐĂNG KÝ  
            </button>  
          </div>  
        ))}  
      </div>  
    </div>  
  );  
};  

export default Subscription;