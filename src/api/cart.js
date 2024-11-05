import { axiosInstances } from '../utils/axios';

// Lấy thông tin giỏ hàng của người dùng
export const getUserCart = async (userId) => {
  try {
    const response = await axiosInstances.login.get(`/user/${userId}/cart`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
    throw error;
  }
};

// Tạo một giỏ hàng mới cho người dùng
export const createCart = async (userId) => {
  try {
    const response = await axiosInstances.login.post(`/carts?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo giỏ hàng mới:', error);
    throw error;
  }
};

// Xóa tất cả các dịch vụ trong giỏ hàng
export const deleteCart = async (cartId) => {
  try {
    console.log('cartId:', cartId);
    const response = await axiosInstances.login.delete(`/carts/${cartId}/clear`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa giỏ hàng:', error);
    throw error;
  }
};

// Lấy danh sách tất cả các mục trong giỏ hàng
export const getCartItems = async (cartId) => {
  try {
    const response = await axiosInstances.login.get(`/carts/${cartId}/items`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách mục trong giỏ hàng:', error);
    throw error;
  }
};

// Thêm một mục mới vào giỏ hàng
export const addItemToCart = async (userId, itemData) => {
  try {
    // Đảm bảo rằng itemData có cấu trúc đúng
    const requestBody = {
      serviceId: itemData.serviceId,
      branchId: itemData.branchId,
      quantity: itemData.quantity,
    };

    const response = await axiosInstances.login.post(`/cartitems?userId=${userId}`, requestBody);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Lỗi từ server:', error.response.data);
      throw new Error(`Server error: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Lỗi mạng:', error.request);
      throw new Error('Network error: No response received');
    } else {
      // Something else happened
      console.error('Lỗi:', error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// Cập nhật số lượng của một mục trong giỏ hàng
export const updateCartItem = async (cartId, itemId, quantity) => {
  try {
    const response = await axiosInstances.login.put(`/cartitems/cart/${cartId}/item/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật mục trong giỏ hàng:', error);
    throw error;
  }
};

// Cập nhật số lượng của một mục trong giỏ hàng
export const updateCartItemQuantity = async (serviceId, quantity) => {
  try {
    const response = await axiosInstances.login.put(`/cartitems/${serviceId}`, quantity);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi khi cập nhật số lượng mục trong giỏ hàng:', error.response.data);
    } else if (error.request) {
      console.error('Không nhận được phản hồi từ máy chủ:', error.request);
    } else {
      console.error('Lỗi khi thiết lập yêu cầu:', error.message);
    }
    throw error;
  }
};

// Lấy tổng tiền của giỏ hàng
export const getCartTotal = async (cartId) => {
  try {
    const response = await axiosInstances.login.get(`/carts/${cartId}/total`);
    return response.data.total;
  } catch (error) {
    console.error('Lỗi khi lấy tổng tiền của giỏ hàng:', error);
    throw error;
  }
};

// Xóa một mục trong giỏ hàng
export const deleteCartItem = async (itemId) => {
  try {
    const response = await axiosInstances.login.delete('/cartitems', {
      data: [itemId], // Gửi ID của mục cần xóa trong body
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ server:', error.response.data);
      throw new Error(`Server error: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('Lỗi mạng:', error.request);
      throw new Error('Network error: No response received');
    } else {
      console.error('Lỗi:', error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};

export const checkout = async (cartItemIds, accountId, addressId, note) => {
  try {
    if (!Array.isArray(cartItemIds)) {
      throw new Error('cartItemIds phải là một mảng');
    }

    const response = await axiosInstances.login.post('/carts/cart/checkout', {
      cartItemIds,
      accountId,
      addressId,
      isAutoReject: false,
      note,
      isShip: true,
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thực hiện checkout:', error);
    throw error;
  }
};

