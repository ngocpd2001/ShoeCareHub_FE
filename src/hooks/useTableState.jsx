import { useState } from "react";

export function useTableState() {
  const [loading, setLoading] = useState(true);

  const handleOpenLoading = () => setLoading(true);
  const handleCloseLoading = () => setLoading(false);

  return {
    loading,
    handleOpenLoading,
    handleCloseLoading,
  };
}
