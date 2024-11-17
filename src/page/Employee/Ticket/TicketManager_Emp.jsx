import React, { useRef } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import { TableTicket_Emp } from './TableTicket_Emp';
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";

export default function TicketManager_Emp() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">Khiếu nại</h3>
          {/* <Breadcrumb
            items={[
              {
                title: <span className="text-lg">Khiếu nại</span>,
              },
            ]}
          /> */}
        </div>
        {/* <div>
          <ComButton onClick={() => navigate("/employee/ticket/create")}>
            + Thêm vé
          </ComButton>
        </div> */}
      </div>
      <TableTicket_Emp ref={tableRef} />
    </>
  );
}