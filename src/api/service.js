import axios from "axios";
const API_BASE_URL = "https://shoecarehub.site/api/services";

export const getAllService = async () => {
  try {
    const response = await fetch("https://shoecarehub.site/api/services");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API", error);
    throw error;
  }
};


getAllService().then((services) => {
  console.log("Danh sách dịch vụ:", services);
});


export const getServiceById = async (id) => {
  try {
    const response = await fetch(`https://shoecarehub.site/api/services/${id}`);
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API", error);
    throw error;
  }
};

// Sử dụng hàm mới
getServiceById(2).then((service) => {
  console.log("Thông tin dịch vụ:", service);
});
