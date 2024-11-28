import { axiosInstances } from "../utils/axios";

export const getAllOrder = async () => {
  try {
    const response = await axiosInstances.login.get('/orders');
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API đơn hàng", error);
    throw error;
  }
};

export const getOrderByBusiness = async (businessId) => {
  try {
    const response = await axiosInstances.login.get(`/orders/businesses/${businessId}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API đơn hàng theo doanh nghiệp", error);
    throw error;
  }
};

export const getOrderByAccountId = async (accountId) => {
  try {
    const response = await axiosInstances.login.get(`/orders/accounts/${accountId}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API đơn hàng theo tài khoản", error);
    throw error;
  }
};

export const getOrderDetailById = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/orderdetails/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết đơn hàng", error);
    throw error;
  }
};

export const getOrderDetailsByOrderId = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/order/${id}/orderdetails`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API chi tiết đơn hàng theo mã đơn hàng", error);
    throw error;
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const {
      shippingUnit,
      shippingCode,
      deliveredFee,
      status,
      isShip,
      ...timeFields
    } = orderData;

    const statusToTimeField = {
      PENDING: 'pendingTime',
      APPROVED: 'approvedTime',
      RECEIVED: 'revievedTime',
      PROCESSING: 'processingTime',
      STORAGE: 'storagedTime',
      SHIPPING: 'shippingTime',
      DELIVERED: 'deliveredTime',
      FINISHED: 'finishedTime',
      ABANDONED: 'abandonedTime'
    };
    

    const now = new Date();
    const offset = 7;
    now.setHours(now.getHours() + offset);
    
    const currentTime = now.toISOString().slice(0, 19);

    const currentTimeField = statusToTimeField[status];
    if (currentTimeField && !timeFields[currentTimeField]) {
      timeFields[currentTimeField] = currentTime;
    }

    const requestBody = {
      ...timeFields,
      isShip: isShip
    };

    if (isShip === false) {
      requestBody.deliveredFee = 0;
    } else if (isShip === true) {
      requestBody.deliveredFee = deliveredFee;
    }

    if (shippingUnit !== undefined) requestBody.shippingUnit = shippingUnit;
    if (shippingCode !== undefined) requestBody.shippingCode = shippingCode;
    if (status !== undefined) requestBody.status = status;

    const response = await axiosInstances.login.patch(`/orders/${id}`, requestBody);

    return response.data.message;
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng", error);
    throw error;
  }
};

export const createOrderDetail = async (orderDetailData) => {
  try {
    const requestBody = {
      orderId: orderDetailData.orderId || 0,
      branchId: orderDetailData.branchId || 0,
      serviceId: orderDetailData.serviceId || 0,
      materialId: orderDetailData.materialId || 0
    };

    const response = await axiosInstances.login.post('/orderdetails', requestBody);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo chi tiết đơn hàng", error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await axiosInstances.login.get(`/orders/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi gọi API đơn hàng theo ID", error);
    throw error;
  }
};

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

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await axiosInstances.login.put(`/orders/${orderId}/status`, null, {
      params: {
        status: newStatus
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng", error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const updateShipCode = async (id, shipCode) => {
  try {
    const response = await axiosInstances.login.put(`/orders/${id}/ship-code`, { shipCode });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật mã vận chuyển", error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const getOrderShipStatus = async (orderCode) => {
  try {
    const response = await axiosInstances.login.get('/api/order-ship/status', {
      params: { orderCode }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API trạng thái vận chuyển đơn hàng", error);
    throw error;
  }
};

export const updateOrderDetail = async (id, processState, assetUrls) => {
  try {
    const requestBody = {
      processState,
      assetUrls
    };

    const response = await axiosInstances.login.patch(`/orderdetails/${id}`, requestBody);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật chi tiết đơn hàng", error);
    throw error;
  }
};

export const deleteOrderDetail = async (id) => {
  try {
    const response = await axiosInstances.login.delete(`/orderdetails/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa chi tiết đơn hàng", error);
    throw error;
  }
};

export const getProcessesByServiceId = async (serviceId) => {
  try {
    const response = await axiosInstances.login.get(`/processes/by-service/${serviceId}?pageIndex=1&pageSize=10`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy quá trình của dịch vụ", error);
    throw error;
  }
};