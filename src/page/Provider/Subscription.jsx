import React, { useEffect, useState } from 'react';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';  
import { getSubscriptionPacks } from '../../api/subscription';  

const Subscription = () => {  
  const [subscriptionData, setSubscriptionData] = useState([]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSubscriptionPacks();
        if (Array.isArray(result.data.data)) {
          setSubscriptionData(result.data.data);
        } else {
          console.error('Dữ liệu trả về không phải là một mảng:', result.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin gói đăng kí:', error);
      }
    };

    fetchData();
  }, []);  

  return (  
    <div className="container mx-auto p-6 my-3">  
      <h1 className="text-3xl font-bold text-center mb-7 text-[#1C3A9C]">Gói Đăng Ký Nhà Cung Cấp</h1>  
      <div className="flex justify-center space-x-5">  
        {subscriptionData.map((plan) => (  
          <div key={plan.id} className="bg-white shadow-md rounded-lg p-6 w-80 flex flex-col border-2 border-[#3A4980]">  
            <h2 className="text-2xl font-semibold mb-2 text-center">{plan.name}</h2>  
            <p className="text-xl mt-2 mb-1 text-center">{plan.price.toLocaleString()} đ</p>  
            <p className="text-lg text-gray-500 text-center mb-4">{plan.description}</p>  
            {/* <button className="mt-auto bg-[#1C3A9C] text-white py-2 px-4 rounded text-lg">  
              ĐĂNG KÝ  
            </button>   */}
          </div>  
        ))}  
      </div>  
    </div>  
  );  
};  

export default Subscription;