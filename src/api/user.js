import { axiosInstances } from '../utils/axios';  

export const getAddressByAccountId = async (accountId) => {  
  try {  
    const response = await axiosInstances.login.get(`/addresses/account/${accountId}`);  
    return response.data.data;  
  } catch (error) {  
    console.error('Lỗi khi lấy địa chỉ theo ID tài khoản:', error);  
    throw error;  
  }  
}; 