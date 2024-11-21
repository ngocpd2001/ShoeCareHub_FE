import { axiosInstances } from '../utils/axios';

export const getTicketCategories = async () => {
  try {
    const response = await axiosInstances.login.get('/ticket-categories');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại phiếu:', error);
    throw error;
  }
};

export const getCategoryTicketById = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/ticket-categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin loại phiếu:', error);
    throw error;
  }
};

export const createTicketCategory = async (categoryData) => {
    try {
      const response = await axiosInstances.login.post('/ticket-categories', {
        name: categoryData.name,
        priority: Number(categoryData.priority) // Đảm bảo priority là số
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo loại phiếu mới:', error);
      throw error;
    }
  };

  export const updateTicketCategory = async (id, categoryData) => {
    try {
      const requestData = {
        name: String(categoryData.name).trim(),
        priority: Number(categoryData.priority),
        status: String(categoryData.status)
      };

      console.log('Request Data:', requestData);

      const response = await axiosInstances.login.put(
        `/ticket-categories/${id}`, 
        requestData
      );
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Lỗi khi cập nhật loại phiếu');
    }
  };