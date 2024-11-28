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
  if (!id) {
    console.error('ID vật liệu không hợp lệ:', id);
    throw new Error('ID vật liệu không hợp lệ');
  }

  try {
    const response = await axiosInstances.login.get(`/materials/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin vật liệu:', error);
    throw error;
  }
};

export const createMaterial = async (materialData) => {
  const requestBody = {
    branchId: materialData.branchId || [0],
    serviceId: materialData.serviceId,
    name: materialData.name || "string",
    price: materialData.price || 0,
    status: materialData.status || "string",
    assetUrls: materialData.assetUrls || [{ url: "string", type: "string" }]
  };

  try {
    const response = await axiosInstances.login.post(`/materials`, requestBody);
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

export const updateMaterialQuantity = async (branchId, materialId, storage) => {
  const numericStorage = Number(storage);
  
  if (numericStorage <= 0) {
    throw new Error('Số lượng phải lớn hơn 0');
  }

  try {
    const response = await axiosInstances.login.put(
      `/materials/update-quantity`,
      numericStorage,
      {
        params: { branchId, materialId },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMaterialByServiceId = async (id, params = {}) => {
  try {
    const response = await axiosInstances.login.get(`/materials/services/${id}`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy vật liệu theo ID dịch vụ:', error);
    throw error;
  }
};

