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
      const token = response.data.token.startsWith('Bearer ') 
        ? response.data.token 
        : `Bearer ${response.data.token}`;
      localStorage.setItem('token', token);
      console.log('Token saved:', token);
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

    console.log('Token being used:', token);

    const response = await axiosInstances.login.get(`/accounts/${id}`, {  
      headers: {  
        'accept': '*/*',  
        'Authorization': token.startsWith('Bearer') ? token : `Bearer ${token}`,
        'Content-Type': 'application/json'  
      }  
    });  

    if (response.data.status === "success") {  
      return response.data.data;  
    } else {
      if (response.data.statusCode === 401) {
        localStorage.removeItem('token');
        throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      }
      throw new Error(response.data.message || 'Có lỗi xảy ra');  
    }  

  } catch (error) {  
    console.error('Chi tiết lỗi:', error);

    if (error.response?.status === 401 || error.response?.data?.statusCode === 401) {  
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');  
    }  
    throw error;
  }  
};

