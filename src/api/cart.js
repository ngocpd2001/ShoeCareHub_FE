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
export const addItemToCart = async (userId, itemData) => {
  try {
    // Kiểm tra xem là service hay material
    const isService = 'serviceId' in itemData;
    const isMaterial = 'materialId' in itemData;

    if (!isService && !isMaterial) {
      throw new Error('Phải có serviceId hoặc materialId');
    }

    // Tạo request body với các trường cần thiết
    const requestBody = {
      branchId: Number(itemData.branchId),
      quantity: Number(itemData.quantity),
    };

    // Thêm serviceId hoặc materialId tùy theo loại
    if (isService) {
      requestBody.serviceId = Number(itemData.serviceId);
    } else {
      requestBody.materialId = Number(itemData.materialId);
    }

    console.log('Request body for add to cart:', requestBody);

    const response = await axiosInstances.login.post(`/cartitems?userId=${userId}`, requestBody);
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
export const checkoutCart = async ({
  cartItems, // Mảng các cart items được chọn
  accountId,
  addressId,
  isAutoReject = false,
  notes = {}, // Object chứa note cho từng cart
  deliveryOptions = {} // Object chứa delivery option cho từng cart
}) => {
  try {
    // Kiểm tra và đảm bảo cartItems là mảng hợp lệ
    if (!cartItems || !Array.isArray(cartItems)) {
      throw new Error('CartItems không hợp lệ');
    }

    // Tạo cấu trúc carts theo format mới
    const carts = cartItems.map(shop => {
      // Đảm bảo shop.services tồn tại và là mảng
      const services = shop.services || [];
      const cartItemIds = services.map(service => service.id).filter(id => id); // Lọc bỏ các id undefined/null

      return {
        cartItemIds,
        note: notes[shop.branchId] || '',
        isShip: deliveryOptions[shop.branchId] === 'delivery'
      };
    });

    const requestBody = {
      carts,
      accountId: Number(accountId),
      addressId: Number(addressId),
      isAutoReject: Boolean(isAutoReject)
    };

    console.log('Request body before API call:', requestBody);

    const response = await axiosInstances.login.post('/carts/cart/checkout', requestBody);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ server khi thanh toán:', error.response.data);
      throw new Error(`Server error: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('Lỗi mạng khi thanh toán:', error.request);
      throw new Error('Network error: No response received');
    } else {
      console.error('Lỗi khi thiết lập yêu cầu thanh toán:', error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// Thực hiện thanh toán dịch vụ
export const checkoutService = async (checkoutData) => {
  try {
    // Đảm bảo dữ liệu đúng format trước khi gửi
    const formattedData = {
      items: checkoutData.items.map(item => {
        const formattedItem = {
          serviceId: Number(item.serviceId),
          materialId: Number(item.materialId || 0),
          branchId: Number(item.branchId),
          quantity: Number(item.quantity),
          note: checkoutData.notes[item.branchId] || ''
        };
        console.log(`Item ${item.serviceId} note:`, formattedItem.note); // Log để kiểm tra note của từng item
        return formattedItem;
      }),
      accountId: Number(checkoutData.accountId),
      addressId: checkoutData.addressId ? Number(checkoutData.addressId) : undefined,
      isAutoReject: Boolean(checkoutData.isAutoReject),
      isShip: Boolean(checkoutData.isShip)
    };

    // Log chi tiết để kiểm tra
    console.log('Original checkout data:', {
      items: checkoutData.items,
      notes: checkoutData.notes
    });
    
    console.log('Formatted checkout data:', JSON.stringify(formattedData, null, 2));

    const response = await axiosInstances.login.post('/services/service/checkout', formattedData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Lỗi từ server khi thanh toán dịch vụ:', error.response.data);
      throw new Error(`Server error: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('Lỗi mạng khi thanh toán dịch vụ:', error.request);
      throw new Error('Network error: No response received');
    } else {
      console.error('Lỗi khi thiết lập yêu cầu thanh toán dịch vụ:', error.message);
      throw new Error(`Error: ${error.message}`);
    }
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

