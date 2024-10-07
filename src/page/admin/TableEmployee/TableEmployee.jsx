import { useRef, useState } from "react";
import ComCard from "../../../Components/ComCard/ComCard";
import {Tables} from "./Tables";
import ComButton from "../../../Components/ComButton/ComButton";
import ComModal from "../../../Components/ComModal/ComModal";
import { useModalState } from "../../../hooks/useModalState";
import CreateEmployee from "./CreateEmployee";
import { useLocation } from "react-router-dom";
function TableEmployee({  }) {
  const modal = useModalState();
  const tableRef = useRef(null);
  const location = useLocation();
  function getRoleFromPath(pathname) {
    const parts = pathname.split("/");
    return parts[1];
  }
  const director =
    getRoleFromPath(location.pathname) === "staff" ||
    getRoleFromPath(location.pathname) === "admin";


  return (
    <div>
      <div className="flex justify-end pb-2">
        {director?<div>
          <ComButton onClick={modal.handleOpen}>Tạo mới nhân viên</ComButton>
        </div>:<></>}
      </div>
      <ComModal
        width={800}
        isOpen={modal?.isModalOpen}
        onClose={modal?.handleClose}
      >
        <CreateEmployee
          isOpen={modal?.isModalOpen}
          onClose={modal?.handleClose}
          tableRef={tableRef}
        />
      </ComModal>
      <Tables ref={tableRef}  />
    </div>
  );
}

export default TableEmployee;
