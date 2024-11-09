import { axiosInstances } from "../utils/axios";

export const getEmployeeByBusinessId = async (businessId, isDescending = false, pageSize = 10, pageNum = 1) => {
  try {
    const response = await axiosInstances.login.get('/accounts', {
      params: {
        BusinessId: businessId,
        IsDecsending: isDescending,
        PageSize: pageSize,
        PageNum: pageNum
      }
    });
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API nhân viên theo doanh nghiệp", error);
    throw error;
  }
};

