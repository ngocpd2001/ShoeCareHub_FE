import { axiosInstances } from "../utils/axios";

export const getBranchByBusinessId = async (businessId) => {
    try {
      const response = await axiosInstances.login.get(`/branches/business/${businessId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API chi nhánh", error);
      throw error;
    }
  };

  export const getBranchByBranchId = async (branchId) => {
    try {
      const response = await axiosInstances.login.get(`/branches/${branchId}`);
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi gọi API chi nhánh", error);
      throw error;
    }
  };

  export const getServiceByBranchId = async (branchId, pageIndex = 1, pageSize = 10) => {
    try {
      const response = await axiosInstances.login.get(`/services/branches/${branchId}`, {
        params: {
          PageIndex: pageIndex,
          PageSize: pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API dịch vụ theo chi nhánh", error);
      throw error;
    }
  };