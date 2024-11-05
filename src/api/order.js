import { axiosInstances } from "../utils/axios";

export const getAllOrder = async () => {
  try {
    const response = await axiosInstances.login.get('/orders');
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API đơn hàng", error);
    throw error;
  }
};

export const getOrderByBusiness = async (businessId) => {
  try {
    const response = await axiosInstances.login.get(`/orders/businesses/${businessId}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API đơn hàng theo doanh nghiệp", error);
    throw error;
  }
};

export const getOrderByAccountId = async (accountId) => {
  try {
    const response = await axiosInstances.login.get(`/orders/accounts/${accountId}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API đơn hàng theo tài khoản", error);
    throw error;
  }
};

export const getOrderDetailById = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/orderdetails/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết đơn hàng", error);
    throw error;
  }
};

export const getOrderDetailsByOrderId = async (orderId) => {
  try {
    const response = await axiosInstances.login.get(`/order/${orderId}/orderdetails`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết đơn hàng theo mã đơn hàng", error);
    throw error;
  }
};