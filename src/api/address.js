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
  
  export const createAddress = async (addressData) => {
    try {
      // Kiểm tra và đảm bảo rằng addressData có đầy đủ các trường cần thiết
      const requiredFields = [
        "accountId",
        "address",
        "wardCode",
        "ward",
        "districtId",
        "district",
        "provinceId",
        "province",
        "isDefault"
      ];
  
      // Kiểm tra xem tất cả các trường cần thiết có tồn tại trong addressData không
      const isValid = requiredFields.every(field => field in addressData);
  
      if (!isValid) {
        throw new Error("Thiếu thông tin cần thiết cho địa chỉ.");
      }
  
      const response = await axiosInstances.login.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo địa chỉ:', error);
      throw error;
    }
  };

  export const getAddressById = async (id) => {
    try {
        const response = await axiosInstances.login.get(`/addresses/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Lỗi khi lấy địa chỉ theo ID:', error);
        throw error;
    }
};