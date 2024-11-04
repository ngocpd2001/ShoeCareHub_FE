import { axiosInstances } from '../utils/axios';  

export const getBusinessById = async (businessId) => {  
  try {  
    const response = await axiosInstances.login.get(`/businesses/${businessId}`);  
    return response.data.data;  
  } catch (error) {  
    console.error('Lỗi khi lấy thông tin doanh nghiệp:', error);  
    throw error;  
  }  
};  

export const getAllBusiness = async (isDescending = false, pageSize = 10, pageNum = 1) => {
  try {
    const response = await axiosInstances.login.get('/businesses', {
      params: {
        IsDescending: isDescending,
        PageSize: pageSize,
        PageNum: pageNum
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách doanh nghiệp:', error);
    throw error;
  }
};
