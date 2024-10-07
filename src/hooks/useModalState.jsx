import { useState } from "react";

export function useModalState(initialState = false) {
  const [isModalOpen, setIsModalOpen] = useState(initialState);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return {
    isModalOpen,
    handleOpen,
    handleClose,
  };
}
