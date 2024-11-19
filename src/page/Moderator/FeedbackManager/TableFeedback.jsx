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
    <div>

      <Tables ref={tableRef} />
    </div>
  );
}

export default TableFeedback;
