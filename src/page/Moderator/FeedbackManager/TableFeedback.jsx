import { useRef, useState } from "react";
import { Tables } from "./Tables";
import ComButton from "../../../Components/ComButton/ComButton";
import { useModalState } from "../../../hooks/useModalState";
import ComModal from "../../../Components/ComModal/ComModal";
import useRolePermission from "../../../hooks/useRolePermission";
function TableFeedback() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const hasPermission = useRolePermission(["admin", "staff"]);

  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">
            Đánh giá
          </h3>
        </div>
      </div>
      <Tables ref={tableRef} />
    </>
  );
}

export default TableFeedback;
