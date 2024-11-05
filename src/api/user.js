import { axiosInstances } from '../utils/axios';  

export const getAllAccount = async (isDescending = false, pageSize = 10, pageNum = 1) => {  
  try {  
    const response = await axiosInstances.login.get('/accounts', {  
      params: {  
        IsDescending: isDescending,  
        PageSize: pageSize,  
        PageNum: pageNum  
      }  
    });  
    return response.data;  
  } catch (error) {  
    console.error('Lỗi khi lấy danh sách tài khoản:', error);  
    throw error;  
  }  
};  

export const getAddressByAccountId = async (accountId) => {  
  try {  
    const response = await axiosInstances.login.get(`/addresses/account/${accountId}`);  
    return response.data.data;  
  } catch (error) {  
    console.error('Lỗi khi lấy địa chỉ theo ID tài khoản:', error);  
    throw error;  
  }  
};  

export const createAddress = async (addressData) => {
  try {
    const response = await axiosInstances.login.post('/addresses', addressData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo địa chỉ:', error);
    throw error;
  }
};