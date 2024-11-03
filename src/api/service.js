import { axiosInstances } from "../utils/axios";

export const getAllService = async (keyword = '', status = '', pageIndex = 1, pageSize = 10, orderBy = null) => {  
  try {  
    const params = new URLSearchParams({  
      Keyword: keyword,  
      Status: status,  
      PageIndex: pageIndex,  
      PageSize: pageSize,  
    });  
      // Log các tham số để kiểm tra
    // console.log("Keyword:", keyword);
    // console.log("Status:", status);
    // console.log("PageIndex:", pageIndex);
    // console.log("PageSize:", pageSize);
    // console.log("OrderBy:", orderBy);

    if (orderBy !== null && orderBy !== undefined) {  
      params.append('OrderBy', orderBy);  
    }  

    const response = await axiosInstances.login.get(`/services?${params.toString()}`);  
    
    console.log("Dữ liệu nhận được:", response.data); // Log the entire response  

    // Make sure to check both the message and the existence of data  
    if (response.data && response.data.message === "Lấy dịch vụ thành công") {  
      const items = response.data.data?.items;  

      if (!items) {  
        console.error("Không tìm thấy danh sách dịch vụ trong dữ liệu:", response.data.data);  
        return []; // Return empty if items doesn't exist  
      }  
      
      return items; // Return the list of services  
    } else {  
      console.error("Dữ liệu không hợp lệ:", response.data);  
      return []; // Return empty if data is invalid  
    }  
  } catch (error) {  
    console.error("Lỗi khi gọi API", error);  
    throw error; // Rethrowing the error for higher-level catching  
  }  
};

export const getServiceById = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/services/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API", error);
    throw error;
  }
};

export const getServiceByBranchID = async (branchId) => {
  try {
    const response = await axiosInstances.login.get(`/services/branches/${branchId}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API", error);
    throw error;
  }
};



