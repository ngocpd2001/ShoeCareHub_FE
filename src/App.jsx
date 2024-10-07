import { RouterProvider } from "react-router-dom";
import { routers } from "./routes.tsx";
import { NotificationProvider } from "./Notification/Notification.jsx";
import { AuthProvider } from "./Auth/useAuth.jsx";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt
import locale from "antd/es/locale/vi_VN"; // Import locale tiếng Việt cho antd

function App() {
  dayjs.locale("vi");
  return (
      <ConfigProvider locale={locale}>
        <AuthProvider>
          <NotificationProvider>
            <RouterProvider router={routers} />
          </NotificationProvider>
        </AuthProvider>
      </ConfigProvider>
  );
}

export default App;
