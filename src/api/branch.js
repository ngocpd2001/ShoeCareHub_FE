import { axiosInstances } from "../utils/axios";

export const getBranchByBusinessId = async (businessId) => {
    if (!businessId) {
      throw new Error('BusinessId là bắt buộc');
    }
    
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

  export const getServiceByBranchId = async (
    branchId, 
    pageIndex = 1, 
    pageSize = 10, 
    showAll = false,
    options = {}
  ) => {
    try {
      const { keyword, status, orderBy } = options;
      
      const params = {
        PageIndex: pageIndex,
        PageSize: showAll ? 1000 : pageSize
      };

      if (keyword) params.Keyword = keyword;
      if (status) params.Status = status;
      if (orderBy) params.OrderBy = orderBy;

      const response = await axiosInstances.login.get(`/services/branches/${branchId}`, {
        params
      });

      if (response.data && response.data.message === "Lấy dịch vụ thành công") {
        return {
          message: response.data.message,
          data: {
            items: response.data.data.items || [],
            totalCount: response.data.data.totalCount,
            pageIndex: response.data.data.pageIndex,
            pageSize: response.data.data.pageSize,
            totalPages: response.data.data.totalPages
          }
        };
      }
      
      throw new Error("Không thể lấy dữ liệu dịch vụ");
    } catch (error) {
      console.error("Lỗi khi gọi API dịch vụ theo chi nhánh", error);
      throw error;
    }
  };

  export const getOrdersByBranchId = async (branchId) => {
    try {
      const response = await axiosInstances.login.get(`/orders/branches/${branchId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng theo chi nhánh", error);
      throw error;
    }
  };

  export const getFeedbackByBranchId = async (branchId, pageIndex = 1, pageSize = 10) => {
    if (!branchId) {
      throw new Error('BranchId là bắt buộc');
    }

    try {
      const response = await axiosInstances.login.get(
        `/feedbacks/branches/${branchId}`,
        {
          params: {
            pageIndex,
            pageSize
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đánh giá theo chi nhánh", error);
      throw error;
    }
  };

  export const updateStatusBranch = async (id, status) => {
    try {
      const currentBranch = await getBranchByBranchId(id);
      if (currentBranch.status === status) {
        throw new Error('Trạng thái chi nhánh không thay đổi');
      }
  
      const response = await axiosInstances.login.put(`/branches/${id}/status`, {
        status: status
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái chi nhánh:', error);
      throw error;
    }
  };