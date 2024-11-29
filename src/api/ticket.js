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

export const getAllTicket = async (pageNum = 1, pageSize = 10, isDescending = false, searchKey = '', status = '') => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      throw new Error('Không tìm thấy thông tin đăng nhập');
    }

    const params = {
      AccountId: user.id,
      SearchKey: searchKey,
      Status: status,
      IsDecsending: isDescending,
      PageSize: pageSize,
      PageNum: pageNum
    };

    const response = await axiosInstances.login.get('/support-tickets', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: params
    });

    return {
      tickets: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phiếu hỗ trợ:', error);
    throw error;
  }
};

export const cancelTicket = async (id) => {
  try {
    const response = await axiosInstances.login.put(`/support-tickets/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi hủy phiếu hỗ trợ:', error);
    throw new Error(error.response?.data?.message || 'Không thể hủy phiếu hỗ trợ');
  }
};

export const getTicketByBranch = async ({ 
  id, 
  pageSize, 
  pageNum, 
  sortField, 
  isDescending = false,
  searchKey = '',
  status = ''
}) => {
  try {
    const params = {
      SearchKey: searchKey,
      SortBy: sortField || '',
      Status: status,
      IsDecsending: isDescending,
      PageSize: pageSize,
      PageNum: pageNum
    };
    
    console.log('API params:', params);

    const response = await axiosInstances.login.get(
      `/support-tickets/branch/${id}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw error;
  }
};

export const getTicketByBusiness = async ({ id, pageSize, pageNum }) => {
  try {
    const response = await axiosInstances.login.get(
      `/support-tickets/business/${id}?IsDecsending=false&PageSize=${pageSize}&PageNum=${pageNum + 1}`
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phiếu hỗ trợ theo doanh nghiệp:', error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId, status) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token');
    }

    // Kiểm tra status hợp lệ
    const validStatuses = ['OPENING', 'PROCESSING', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      throw new Error('Trạng thái không hợp lệ');
    }

    const response = await axiosInstances.login.put(
      `/support-tickets/${ticketId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    throw error;
  }
};

export const createChildTicket = async (ticketId, data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Chưa đăng nhập");
    }

    const response = await axiosInstances.login.post(
      `/support-tickets/${ticketId}/child-ticket`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getAllTicketsMod = async (pageNum = 1, pageSize = 10, sortField = '', isDescending = false) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy thông tin đăng nhập');
    }

    const response = await axiosInstances.login.get('/support-tickets', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        SortField: sortField,
        IsDecsending: isDescending,
        PageSize: pageSize,
        PageNum: pageNum
      }
    });

    return {
      tickets: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phiếu hỗ trợ:', error);
    throw error;
  }
};

export const notifyCustomerForTicket = async (accountId, ticketId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token');
    }

    const response = await axiosInstances.login.post(
      `/support-tickets/notify-for-customer?AccountId=${accountId}&TicketId=${ticketId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Lỗi khi gửi thông báo cho khách hàng:', error);
    throw new Error(error.response?.data?.message || 'Không thể gửi thông báo cho khách hàng');
  }
};