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
// export const createCart = async (userId) => {
//   try {
//     const response = await axiosInstances.login.post(`/carts?userId=${userId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Lỗi khi tạo giỏ hàng mới:', error);
//     throw error;
//   }
// };

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

// Thêm một mục mới vào giỏ hàng
export const addToCart = async ({ userId, serviceId, materialId, branchId }) => {
  try {
    const requestBody = {
      serviceId,
      branchId
    };

    // Chỉ thêm materialId vào requestBody nếu nó có giá trị
    if (materialId) {
      requestBody.materialId = materialId;
    }

    const response = await axiosInstances.login.post(`/cartitems?userId=${userId}`, requestBody);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    throw error;
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


// Lấy thông tin một mục trong giỏ hàng theo ID
export const getCartItemById = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/cartitems/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin mục trong giỏ hàng:', error);
    throw error;
  }
};

// Thực hiện thanh toán giỏ hàng
export const checkoutCart = async (checkoutData) => {
  try {
    // Kiểm tra xem checkoutData.cartItems có hợp lệ không
    if (!checkoutData.cartItems || !Array.isArray(checkoutData.cartItems)) {
      throw new Error("cartItems không hợp lệ.");
    }

    const requestBody = {
      cart: {
        cartItems: checkoutData.cartItems.map(item => ({
          cartItemId: item.cartItemId,
          note: item.note
        })),
        isShip: checkoutData.isShip
      },
      accountId: checkoutData.accountId,
      addressId: checkoutData.addressId,
      isAutoReject: checkoutData.isAutoReject
    };

    const response = await axiosInstances.login.post('/carts/cart/checkout', requestBody);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ server khi thanh toán giỏ hàng:', error.response.data);
      throw new Error(`Server error: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('Lỗi mạng khi thanh toán giỏ hàng:', error.request);
      throw new Error('Network error: No response received');
    } else {
      console.error('Lỗi khi thiết lập yêu cầu thanh toán giỏ hàng:', error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// Thực hiện thanh toán dịch vụ
export const checkoutService = async (checkoutData) => {
  try {
    const requestBody = {
      item: {
        serviceId: checkoutData.item.serviceId,
        materialId: checkoutData.item.materialId,
        branchId: checkoutData.item.branchId
      },
      accountId: checkoutData.accountId,
      addressId: checkoutData.addressId,
      isAutoReject: checkoutData.isAutoReject,
      note: checkoutData.note,
      isShip: checkoutData.isShip
    };

    const response = await axiosInstances.login.post('/services/service/checkout', requestBody);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thanh toán dịch vụ:', error.message);
    throw error; // Chỉ ném lại lỗi mà không cần xử lý chi tiết
  }
};

// Tính phí ship dựa trên địa chỉ và số lượng
export const calculateShippingFee = async ({ addressId, branchId, quantity }) => {
  try {
    console.log("Calculating shipping fee with:", { addressId, branchId, quantity });
    const response = await axiosInstances.login.get(`/carts/cart/checkout/feeship`, {
      params: {
        addressId,
        branchId,
        quantity
      }
    });
    console.log("Shipping fee response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error calculating shipping fee:", error);
    // Kiểm tra lỗi không hỗ trợ ship
    if (error.response?.data?.message?.includes('Không hỗ trợ ship')) {
      return {
        error: error.response.data.message
      };
    }
    throw error;
  }
};

