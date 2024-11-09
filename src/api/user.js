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

export const login = async (email, password) => {
  try {
    const response = await axiosInstances.login.post('/auth/login', {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Token saved:', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};

export const getAccountById = async (id) => {  
  try {  
    const token = localStorage.getItem('token');  
    if (!token) {  
      throw new Error('Không tìm thấy token xác thực');  
    }  

    // console.log('Token being used:', token);  

    const response = await axiosInstances.login.get(`/accounts/${id}`, {  
      headers: {  
        'accept': '*/*',  
        'Authorization': `Bearer ${token}`,  
        'Content-Type': 'application/json'  
      }  
    });  

    console.log('API Response:', response);  

    if (response.data.status === "success") {  
      return response.data.data;  
    } else {  
      throw new Error(response.data.message);  
    }  

  } catch (error) {  
    console.error('Chi tiết lỗi:', error); // Changed from error.response?.data to error  
    if (error.response?.status === 401) {  
      console.log('Current token in localStorage:', localStorage.getItem('token'));  
      localStorage.removeItem('token');  
      throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');  
    }  
    throw error; // Re-throwing the error to handle in the calling function  
  }  
};

