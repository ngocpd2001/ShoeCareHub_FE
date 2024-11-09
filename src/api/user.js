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

// export const getAccountById = async (id) => {
//   const token = localStorage.getItem('token'); 
//   try {
//     const response = await axiosInstances.login.get(`/accounts/${id}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`, 
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Lỗi khi lấy tài khoản theo ID:', error);
//     throw error;
//   }
// };

export const getAccountById = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/accounts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tài khoản theo ID:', error);
    throw error;
  }
};



