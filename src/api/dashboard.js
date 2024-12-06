// src/api/businessStatistics.js

import { axiosInstances } from '../utils/axios';

export const getBusinessStatisticsByMonth = async (businessId) => {
  try {
    const response = await axiosInstances.login.get(`/api/business-statistics/${businessId}/order-by-month`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin thống kê theo tháng:', error);
    throw error;
  }
};

export const getBusinessStatisticsByYear = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/api/business-statistics/${businessId}/order-by-year`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thống kê theo năm:', error);
      throw error;
    }
  };

  export const getBusinessFeedbackByMonth = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/api/business-statistics/${businessId}/feedback-by-month`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phản hồi theo tháng:', error);
      throw error;
    }
  };

  export const getBusinessFeedbackByYear = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/api/business-statistics/${businessId}/feedback-by-year`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phản hồi theo năm:', error);
      throw error;
    }
  };

  export const getBusinessProfitByMonth = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/api/business-statistics/${businessId}/profit-by-month`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin lợi nhuận theo tháng:', error);
      throw error;
    }
  };

  export const getBusinessProfitByYear = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/api/business-statistics/${businessId}/profit-by-year`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin lợi nhuận theo năm:', error);
      throw error;
    }
  };
