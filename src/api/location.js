import { axiosInstances } from '../utils/axios';  

export const getLocationProvinces = async () => {
  try {
    const response = await axiosInstances.login.get('/locations/provinces');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tỉnh:', error);
    throw error;
  }
}; 

export const getDistrictsByProvinceID = async (provinceID) => {
  try {
    const response = await axiosInstances.login.get(`/locations/${provinceID}/districts`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách huyện cho tỉnh ID ${provinceID}:`, error);
    throw error;
  }
}; 

export const getWardsByDistrictID = async (districtID) => {
  try {
    const response = await axiosInstances.login.get(`/locations/${districtID}/wards`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách xã cho huyện ID ${districtID}:`, error);
    throw error;
  }
}; 

