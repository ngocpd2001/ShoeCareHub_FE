import { axiosInstances } from '../utils/axios';

export const getCategoryTicket = async () => {
    try {
      const response = await axiosInstances.login.get('/ticket-categories');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách loại phiếu:', error);
      throw error;
    }
  };

export const createTicket = async (ticketData) => {
  try {
    const response = await axiosInstances.login.post('/support-tickets', {
      categoryId: ticketData.categoryId,
      title: ticketData.title,
      content: ticketData.content,
      assets: ticketData.assets || [] // Mảng assets là tùy chọn
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo phiếu hỗ trợ:', error);
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

export const getTicketById = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/support-tickets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phiếu hỗ trợ:', error);
    throw error;
  }
};

export const createTicketOrder = async (ticketData) => {
  try {
    const response = await axiosInstances.login.post('/support-tickets/order-ticket', {
      orderId: ticketData.orderId,
      title: ticketData.title,
      content: ticketData.content,
      assets: ticketData.assets || [] // Mảng assets là tùy chọn
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo phiếu khiếu nại đơn hàng:', error);
    throw error;
  }
};

export const getAllTicket = async ({
  searchKey = '',
  sortBy = '',
  status = '',
  isDescending = false,
  pageSize = 10,
  pageNum = 1
}) => {
  try {
    const response = await axiosInstances.login.get('/support-tickets', {
      params: {
        searchKey,
        sortBy,
        status,
        isDescending,
        pageSize,
        pageNum
      }
    });

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Có lỗi xảy ra');
    }

    return {
      tickets: response.data.data || [],
      pagination: response.data.pagination || {
        totalItems: 0,
        pageSize: pageSize,
        currentPage: pageNum,
        totalPages: 0
      }
    };

  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    }
    
    console.error('Lỗi khi lấy danh sách phiếu hỗ trợ:', error);
    throw new Error(error.response?.data?.message || 'Không thể lấy danh sách phiếu hỗ trợ');
  }
};

export const cancelTicket = async (id) => {
  try {
    const response = await axiosInstances.login.put(`/support-tickets/${id}/cancel`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    }
    console.error('Lỗi khi hủy phiếu hỗ trợ:', error);
    throw new Error(error.response?.data?.message || 'Không thể hủy phiếu hỗ trợ');
  }
};