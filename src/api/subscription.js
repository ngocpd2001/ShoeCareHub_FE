import { axiosInstances } from '../utils/axios';

export const getSubscriptionPacks = async () => {
    try {
      const response = await axiosInstances.login.get('/subscription-packs');
      return {
        status: 'success',
        statusCode: 200,
        message: 'Lấy Thông Tin Gói Đăng Kí Thành Công!',
        data: response.data
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin gói đăng kí:', error);
      throw error;
    }
  };