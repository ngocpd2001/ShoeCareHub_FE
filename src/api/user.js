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

export const getAccountById = async (id) => {  
  try {  
    const response = await axiosInstances.login.get(`/accounts/${id}`);
    return response.data;
  } catch (error) {  
    throw error;
  }  
};

export const createModerator = async (moderatorData) => {
  try {
    const response = await axiosInstances.login.post('/accounts/moderator', {
      email: moderatorData.email,
      fullName: moderatorData.fullName,
      phone: moderatorData.phone,
      gender: moderatorData.gender,
      dob: moderatorData.dob
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản moderator:', error);
    throw error;
  }
};

