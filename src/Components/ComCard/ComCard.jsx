import React from "react";

export default function ComCard({ title, value, icon, onClick, isSelected }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-1 border shadow-md flex flex-col items-center cursor-pointer ${
        isSelected
          ? "bg-[#0F296D] text-white border-indigo-600" // Viền xanh khi được chọn
          : "bg-white text-black border-gray-300" // Viền xám khi không được chọn
      }`}
    >
      <div className="flex justify-between items-center gap-3">
        {icon && (
          <div
            className={`rounded-full p-2 ${
              isSelected ? "bg-white" : "bg-black" // Màu nền icon
            }`}
          >
            {icon}
          </div>
        )}
        <div className="h-14 justify-center flex items-center">
          <div className="font-mono font-bold text-center text-xl">{title}</div>
         
        </div>
      </div>
    </div>
  );
}
