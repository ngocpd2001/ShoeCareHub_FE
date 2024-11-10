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

// export const login = async (email, password) => {
//   try {
//     const response = await axiosInstances.login.post('/auth/login', {
//       email,
//       password
//     });
    
//     if (response.data.token) {
//       const token = response.data.token.replace(/^["']|["']$/g, '').trim();
//       localStorage.setItem('token', token);
//       console.log('Token đã lưu:', token);
//     }
    
//     return response.data;
//   } catch (error) {
//     console.error('Lỗi khi đăng nhập:', error);
//     throw error;
//   }
// };

export const getAccountById = async (id) => {  
  try {  
    const response = await axiosInstances.login.get(`/accounts/${id}`);
    return response.data;
  } catch (error) {  
    throw error;
  }  
};

