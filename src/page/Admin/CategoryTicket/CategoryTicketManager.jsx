import React, { useRef, useState } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import { TableCategoryTicket } from './TableCategoryTicket';
import CreateCategoryTicket from './CreateCategoryTicket';

export default function CategoryTicketManager() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (tableRef.current) {
      tableRef.current.reloadData();
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">
            Quản lý danh mục khiếu nại
          </h3>
        </div>
        <div>
          <ComButton onClick={handleOpenModal}>
            + Thêm danh mục 
          </ComButton>
        </div>
      </div>
      <TableCategoryTicket ref={tableRef} />
      
      <CreateCategoryTicket 
        open={isModalOpen} 
        onCancel={handleCloseModal}
      />
    </>
  );
}