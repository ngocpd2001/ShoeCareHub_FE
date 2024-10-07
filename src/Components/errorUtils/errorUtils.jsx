export const handleErrors = (error, setError, setFocus) => {
  const errorMapping = {
    // 409: { field: "name", message: "Đã có tên này!" },
    600: { field: "phoneNumber", message: "Đã có số điện thoại này!" },
    601: { field: "email", message: "Đã có Email này!" },
    602: { field: "cccd", message: "Đã có CMND/CCCD này!" },
    603: { field: "userName", message: "Đã có Tên đăng nhập này!" },
    604: { field: "roomId", message: "Phòng đã đầy!" },
    605: {
      field: "roomId",
      message: "Phòng với gói dưỡng lão khác nhau!",
    },
    606: {
      field: "roomId",
      message: "Phòng với gói dưỡng lão khác nhau, gói dưỡng lão khác nhau",
    },
    607: {
      field: "#",
      message: "Không tìm thấy ca trực",
    },
    612: {
      field: "nursingPackageId",
      message: "Gói điều dưỡng không có giá trị",
    },
    613: {
      field: "nursingPackageId",
      message: "Đã có người trong phòng không thể đổi gói dưỡng lão!",
    },
    614: {
      field: "nursingPackageId",
      message: "Gói dịch vụ đã đủ người, vui lòng chọn dịch vụ khác",
    },
    615: {
      field: "nursingPackageId",
      message: "Gói dịch đã hết hạn, vui lòng chọn dịch vụ khác",
    },
    616: {
      field: "startDate",
      message: "Thời gian trùng với ngày hợp đồng cũ",
    },
    617: {
      field: "name",
      message: "Phòng trống không được đặt lịch",
    },
    618: {
      field: "name",
      message: "Phòng trống không được đặt lịch",
    },
    619: {
      field: "name",
      message: "Phòng trống không được đặt lịch",
    },
    621: {
      field: "capacity",
      message:
        "Đã có người sử dụng nên không thể thay đổi số người trong phòng",
    },
    622: {
      field: "numberOfNurses",
      message:
        "Đã có người sử dụng nên không thể thay đổi số lượng điều dưỡng ",
    },
    625: {
      field: "contract.name",
      message: "Đã có số hợp đồng này",
    },
    626: {
      field: "name",
      message: "Đã có số hợp đồng này",
    },
    629: {
      field: "name",
      message: "Người này đã xuất viện không thể sửa ",
    },
  };

  const status = error?.response?.data?.status || error?.data?.status;
  if (errorMapping[status]) {
    const { field, message, field1 } = errorMapping[status];
    if (field1) {
      setError(field, { message });
      setFocus(field);
    }
    setError(field, { message });
    setFocus(field);
  }
};
