import { useRef, useState } from "react";
import {  TableTransfer } from "./TableTransfer";
import ComModal from "../../../Components/ComModal/ComModal";

import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import { useLocation } from "react-router-dom";
import useRolePermission from "../../../hooks/useRolePermission";
import ComCard from "../../../Components/ComCard/ComCard";
import { TablesExit } from './TablesExit';

export default function TableElderTransfer() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const cardData = [
    { title: "Chuyển phòng ", value: "10.678" },
    { title: "Xuất viện ", value: "1.000" },
  ];
  const handleCardClick = (index) => {
    setSelectedCardIndex(index);
  };
  const viewTable = () => {
    switch (selectedCardIndex) {
      case 0:
        return <TableTransfer ref={tableRef} />;
      case 1:
        return <TablesExit ref={tableRef} />;

      default:
        break;
    }
  };
  const hasPermission = useRolePermission(["admin", "staff"]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 pb-2">
        {cardData.map((card, index) => (
          <ComCard
            key={index} // Sử dụng index làm key
            onClick={() => handleCardClick(index)}
            isSelected={selectedCardIndex === index}
            {...card}
          />
        ))}
      </div>
      {viewTable()}
    </div>
  );
}
