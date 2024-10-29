import { axiosInstances } from "../utils/axios";

const getAllService = async () => {
  try {
    const response = await axiosInstances.login.get('/services');
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API", error);
    throw error;
  }
};

const getServiceById = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/services/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API", error);
    throw error;
  }
};


export { getAllService, getServiceById };
