// src/api/businessStatistics.js

import { axiosInstances } from '../utils/axios';

export const getBusinessStatisticsByMonth = async (businessId) => {
  try {
    const response = await axiosInstances.login.get(`/business-statistics/${businessId}/order-by-month`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin thống kê theo tháng:', error);
    throw error;
  }
};

export const getBusinessStatisticsByYear = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/business-statistics/${businessId}/order-by-year`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thống kê theo năm:', error);
      throw error;
    }
  };

  export const getBusinessFeedbackByMonth = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/business-statistics/${businessId}/feedback-by-month`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phản hồi theo tháng:', error);
      throw error;
    }
  };

  export const getBusinessFeedbackByYear = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/business-statistics/${businessId}/feedback-by-year`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phản hồi theo năm:', error);
      throw error;
    }
  };

  export const getBusinessProfitByMonth = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/business-statistics/${businessId}/profit-by-month`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin lợi nhuận theo tháng:', error);
      throw error;
    }
  };

  export const getBusinessProfitByYear = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/business-statistics/${businessId}/profit-by-year`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin lợi nhuận theo năm:', error);
      throw error;
    }
  };

  export const getPlatformProfitByYear = async () => {
    try {
      const response = await axiosInstances.login.get('/platform-statistics?Type=PROFIT&IsMonth=false');
      return response.data.data.value; // Trả về giá trị lợi nhuận
    } catch (error) {
      console.error('Lỗi khi lấy thông tin lợi nhuận của nền tảng:', error);
      throw error;
    }
  };

  export const getPlatformProfitByMonth = async () => {
    try {
        const response = await axiosInstances.login.get('/platform-statistics?Type=PROFIT&IsMonth=true');
        return response.data.data.value; // Trả về giá trị lợi nhuận theo tháng
    } catch (error) {
        console.error('Lỗi khi lấy thông tin lợi nhuận của nền tảng theo tháng:', error);
        throw error;
    }
  };

export const getPlatformOrderByMonth = async () => {
  try {
      const response = await axiosInstances.login.get('/platform-statistics?Type=ORDER&IsMonth=true');
      return response.data.data.value; // Trả về giá trị đơn hàng theo tháng
  } catch (error) {
      console.error('Lỗi khi lấy thông tin đơn hàng của nền tảng theo tháng:', error);
      throw error;
  }
};

export const getPlatformOrderByYear = async () => {
  try {
      const response = await axiosInstances.login.get('/platform-statistics?Type=ORDER&IsMonth=false');
      return response.data.data.value; // Trả về giá trị đơn hàng theo năm
  } catch (error) {
      console.error('Lỗi khi lấy thông tin đơn hàng của nền tảng theo năm:', error);
      throw error;
  }
};

export const getPlatformUser = async () => {
  try {
      const response = await axiosInstances.login.get('/platform-statistics/user-statistic');
      return response.data.data.value; // Trả về giá trị thống kê người dùng
  } catch (error) {
      console.error('Lỗi khi lấy thông tin thống kê người dùng:', error);
      throw error;
  }
};

