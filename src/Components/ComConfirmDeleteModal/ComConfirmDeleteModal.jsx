import { Modal } from "antd";
import { deleteData, putData } from "../../api/api";

const ComConfirmDeleteModal = async (
  apiPath,
  id,
  message,
  onSuccess,
  oke,
  failed,
  put
) => {
  if (put) {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: message,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        putData(`${apiPath}`, `${id}/change-state`, {
          state: "Deleted",
        })
          .then((e) => {
            onSuccess();
            oke();
          })
          .catch((error) => {
            failed();
            console.log("error", error);
          });
      },
    });
  } else {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: message,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        deleteData(`${apiPath}`, id)
          .then((e) => {
            onSuccess();
            oke();
          })
          .catch((error) => {
            failed();
            console.log("error", error);
          });
      },
    });
  }
};

export default ComConfirmDeleteModal;
