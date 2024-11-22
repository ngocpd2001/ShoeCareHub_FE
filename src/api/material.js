import { axiosInstances } from '../utils/axios';

export const getAllMaterials = async (pageIndex = 1, pageSize = 10) => {
  try {
    const response = await axiosInstances.login.get('/materials', {
      params: {
        PageIndex: pageIndex,
        PageSize: pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách vật liệu:', error);
    throw error;
  }
};

export const getMaterialById = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/materials/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin vật liệu:', error);
    throw error;
  }
};

export const createMaterial = async (serviceId, materialData) => {
  try {
    const response = await axiosInstances.login.post(`/materials`, materialData, {
      params: {
        serviceId: serviceId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo vật liệu mới:', error);
    throw error;
  }
};

export const updateMaterial = async (id, materialData) => {
  try {
    const response = await axiosInstances.login.put(`/materials/${id}`, materialData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật vật liệu:', error);
    throw error;
  }
};

export const deleteMaterial = async (id) => {
  try {
    const response = await axiosInstances.login.delete(`/materials/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa vật liệu:', error);
    throw error;
  }
};

export const getMaterialsByBusiness = async (businessId, pageIndex = 1, pageSize = 10) => {
  try {
    const response = await axiosInstances.login.get(`/materials/businesses/${businessId}`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách vật liệu theo doanh nghiệp:', error);
    throw error;
  }
};  