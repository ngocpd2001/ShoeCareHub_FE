import React, { useRef } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import { TableTicket_Ad } from './TableTicket_Ad';
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";

export default function TicketManager_Ad() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">Quản lý khiếu nại</h3>
        </div>
      </div>
      <TableTicket_Ad ref={tableRef} />
    </>
  );
}