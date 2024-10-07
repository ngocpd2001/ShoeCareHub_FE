import React, { useContext, useEffect, useState } from "react";
import { Button, notification, Space } from "antd";
import { LanguageContext } from "../../contexts/LanguageContext";
const ComNotification = ({ notificationType }) => {
  const {
    text: { Notification },
  } = useContext(LanguageContext);

  const [notificationOpened, setNotificationOpened] = useState(false);

  useEffect(() => {
    if (notificationOpened) {
      openNotificationWithIcon(notificationType);
      setNotificationOpened(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationType, notificationOpened]);

  const openNotificationWithIcon = (type) => {
    const key = `open${Date.now()}`;
    // const btn = (
    //   <Space>
    //     <Button type="link" size="small" onClick={() => notification.destroy()}>
    //       Destroy All
    //     </Button>
    //     <Button
    //       type="primary"
    //       size="small"
    //       onClick={() => notification.destroy(key)}
    //     >
    //       Confirm
    //     </Button>
    //   </Space>
    // );
    const notifications = Notification.find(
      (item) => item.name === notificationType
    );

    notification[type]({
      message: notifications.message,
      description: notifications.description,
      //   btn,
      key,
      duration: 5,
      //   className: "custom-class",
      //   style: {
      //     backgroundColor: "red",
      //   },
    });
  };
  useEffect(() => {
    setNotificationOpened(true);
  }, [notificationType]);

  return null;
};
export default ComNotification;
