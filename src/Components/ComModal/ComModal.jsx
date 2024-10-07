import React, { useEffect, useState } from "react";
import { Modal } from "antd";

function ComModal({ isOpen, onClose, children, title, width }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setKey((prevKey) => prevKey + 1);
    }
  }, [isOpen]);

  return (
    <Modal
      title={title}
      open={isOpen}
      width={width || 500}
      onCancel={onClose}
      footer={null}
    >
      <div key={key}>{children}</div>
    </Modal>
  );
}

export default ComModal;
