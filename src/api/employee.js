import { axiosInstances } from "../utils/axios";

export const getEmployeeByBusinessId = async (businessId) => {
  try {
    const response = await axiosInstances.login.get('/accounts/employees', {
      params: {
        BusinessId: businessId,
        IsDecsending: false,
        PageSize: 10,
        PageNum: 1
      }
    });
    
    return {
      employees: Array.isArray(response.data.data) ? response.data.data : [],
      pagination: response.data.pagination,
      message: response.data.message,
      status: response.data.status
    };
  } catch (error) {
    console.error("Chi tiết lỗi validation:", error.response?.data);
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await axiosInstances.login.post('/accounts/employee', {
      email: employeeData.email,
      fullName: employeeData.fullName,
      phone: employeeData.phone,
      gender: employeeData.gender,
      dob: employeeData.dob,
      branchId: employeeData.branchId
    });
    
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.data.status,
      statusCode: response.data.statusCode
    };
  } catch (error) {
    console.error("Lỗi khi tạo nhân viên:", error.response?.data);
    throw error;
  }
};

export const deleteEmployee = async (employeeId) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axiosInstances.login.delete(`/accounts/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return {
      status: "success"
    };
  } catch (error) {
    throw error;
  }
};

