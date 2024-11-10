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
      const token = response.data.token.replace(/^["']|["']$/g, '').trim();
      localStorage.setItem('token', token);
      console.log('Token đã lưu:', token);
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

    console.log('Token gốc:', token);

    const cleanToken = token.replace(/^["']|["']$/g, '').trim();
    
    console.log('Token sau khi làm sạch:', cleanToken);

    const headers = {
      'Authorization': 'Bearer ' + cleanToken,
      'Content-Type': 'application/json'
    };

    const response = await axiosInstances.login.get(`/accounts/${id}`, { headers });  

    return response.data;
  } catch (error) {  
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    }
    
    throw error;
  }  
};

