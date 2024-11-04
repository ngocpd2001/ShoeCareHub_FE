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