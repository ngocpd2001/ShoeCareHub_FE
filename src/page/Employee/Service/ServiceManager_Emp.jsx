import React, { useRef } from "react";
import { useModalState } from "../../../hooks/useModalState";
import { TableService_Emp } from "./TableService_Emp";
import { Breadcrumb } from "antd";

export default function ServiceManager_Emp() {
  const modal = useModalState();
  const tableRef = useRef(null);

  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">Dịch vụ</h3>
          <Breadcrumb
            items={[
              {
                title: "Cửa hàng",
              },
              {
                title: "Dịch vụ",
              },
            ]}
          />
        </div>
      </div>
      <TableService_Emp ref={tableRef} />
    </>
  );
}
