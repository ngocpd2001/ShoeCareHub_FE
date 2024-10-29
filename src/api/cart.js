import axios from 'axios';
import { axiosInstances } from '../utils/axios';

const API_BASE_URL = 'https://shoecarehub.site/api';

// Lấy thông tin giỏ hàng của người dùng
export const getUserCart = async (userId) => {
  try {
    const response = await axiosInstances.login.get(`/user/${userId}/cart`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
    throw error;
  }
};

// Lấy tổng giá trị của giỏ hàng
export const getCartTotal = async (cartId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/carts/${cartId}/total`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tổng giá trị giỏ hàng:', error);
    throw error;
  }
};

// Tạo một giỏ hàng mới cho người dùng
export const createCart = async (userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/carts?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo giỏ hàng mới:', error);
    throw error;
  }
};

// Xóa tất cả các dịch vụ trong giỏ hàng
export const deleteCart = async (cartId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/carts/${cartId}/clear`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa giỏ hàng:', error);
    throw error;
  }
};

// Lấy danh sách tất cả các mục trong giỏ hàng
export const getCartItems = async (cartId) => {
  try {
    
    const response = await axiosInstances.login.get(`/cartitems/cart/${cartId}`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách mục trong giỏ hàng:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết về một mục cụ thể
export const getCartItem = async (itemId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cartitems/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin chi tiết mục:', error);
    throw error;
  }
};

// Lấy tổng giá trị của tất cả các mục trong giỏ hàng
export const getCartItemTotal = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cartitems/total`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tổng giá trị giỏ hàng:', error);
    throw error;
  }
};

// Thêm một mục mới vào giỏ hàng
export const addItemToCart = async (userId, itemData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cartitems?userId=${userId}`, itemData);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm mục vào giỏ hàng:', error);
    throw error;
  }
};

// Cập nhật số lượng của một mục trong giỏ hàng
export const updateCartItem = async (cartId, itemId, quantity) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/cartitems/cart/${cartId}/item/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật mục trong giỏ hàng:', error);
    throw error;
  }
};

// Xóa tất cả các mục trong giỏ hàng
export const clearCartItems = async (cartId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cartitems/cart/${cartId}/items`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa các mục trong giỏ hàng:', error);
    throw error;
  }
};