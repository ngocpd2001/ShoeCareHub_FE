import {
  Outlet,
  createBrowserRouter,
  Navigate,
  useLocation,
} from "react-router-dom";
import React from "react";
import LoginPage from "./page/login/LoginPage";
import ErrorPage from "./page/404/ErrorPage";
import ComHeaderOwner from "./Components/ComHeaderOwner/ComHeaderOwner";
import Home from "./page/Home/Home";
import ComHeader from "./Components/ComHeader/ComHeader";
import ServiceDetail from "./page/Service/ServiceDetail";
import ProviderLandingPage from "./page/Provider/ProviderLandingPage";
import Subscription from "./page/Provider/Subscription";
import ComHeaderUser from "./Components/ComHeaderUser/ComHeaderUser";
import UserCart from "./page/Cart&Checkout/UserCart";
import Checkout from "./page/Cart&Checkout/Checkout";
import OrderHistory from "./page/OrderHistory/OrderHistory";
import ProfilePage from "./page/ProfileUser/ProfileUser";
import ServiceManager from "./page/Owner/Service/ServiceManager";
import DetailService from "./page/Owner/Service/DetailService";
import CreateSevice from "./page/Owner/Service/CreateService";
import OrderManager from "./page/Owner/Order/OrderManager";
import OrderDetail from "./page/Owner/Order/OrderDetail";
import UpdateOrder from "./page/Owner/Order/UpdateOrder";
import Dashboard from "./page/Owner/Dashboard";
import EmployeeManager from "./page/Owner/Employee/EmployeeManager";
import EmployeeDetail from "./page/Owner/Employee/EmployeeDetail";
import CreateEmployee from "./page/Owner/Employee/CreateEmployee";
import BranchManager from "./page/Owner/Branch/BranchManager";
import CreateBranch from "./page/Owner/Branch/CreateBranch";
import { isValidToken } from "./utils/jwt";
import AddressesUser from "./page/AddressesUser/AddressesUser";
import ResetPassword from "./page/ResetPassword/ResetPassword";
import RegisterPage from "./page/Register/RegisterPage";
import RegisterOwner from "./page/Register/RegisterOwner";
import ServiceDiscounted from "./page/ServiceDiscounted/ServiceDiscounted";
import ServiceAll from "./page/ServiceDiscounted/ServiceAll";
import CheckoutService from "./page/Cart&Checkout/CheckoutService";
import TicketScreen from "./page/Ticket_User/TicketScreen";
import CreateTicket from "./page/Ticket_User/CreateTicket";
import CreateTicketOrder from "./page/Ticket_User/CreateTicketOrder";
import TicketManager from "./page/Owner/Ticket/TicketManager";
import TicketDetail from "./page/Owner/Ticket/TicketDetail";
import UpdateTicket from "./page/Owner/Ticket/UpdateTicket";
import ComHeaderAdmin from "./Components/ComHeaderAdmin/ComHeaderAdmin";
import TableFeedback from "./page/admin/FeedbackManager/TableFeedback";
import ComHeaderModerator from './Components/ComHeaderModerator/ComHeaderModerator';
import EmailVerificationFailedScreen from "./page/EmailVerificationFailed/EmailVerificationFailedScreen";
import TicketManager_Mod from "./page/admin/Ticket_Mod/TicketManager_Mod";
import UpdateTicket_Mod from "./page/admin/Ticket_Mod/UpdateTicket_Mod";

// Hàm kiểm tra token hợp lệ
const getCleanToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // Làm sạch token
    const cleanToken = token.replace(/^["']|["']$/g, "").trim();

    // Kiểm tra format token
    const tokenParts = cleanToken.split(".");
    return tokenParts.length === 3 ? cleanToken : null;
  } catch (error) {
    return null;
  }
};

// Hàm kiểm tra trạng thái đăng nhập
const isAuthenticated = () => {
  try {
    const token = getCleanToken();
    if (!token) return false;

    return isValidToken(token);
  } catch (error) {
    return false;
  }
};

// Component bảo vệ route
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Lưu đường dẫn hiện tại để redirect sau khi đăng nhập
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const routers = createBrowserRouter([
  {
    path: "*",
    element: (
      <ComHeader>
        <ErrorPage />
      </ComHeader>
    ),
  },
  {
    path: "/",
    element: (
      <ComHeader>
        <Outlet />
      </ComHeader>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/service-discounted",
        element: <ServiceDiscounted />,
      },
      {
        path: "/typical-provider",
        element: <Home />,
      },
      {
        path: "/service",
        element: <ServiceAll />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/confirm-success",
        element: <LoginPage />,
      },
      {
        path: "/confirm-fail",
        element: <EmailVerificationFailedScreen />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/register-owner",
        element: <RegisterOwner />,
      },
      {
        path: "/servicedetail/:id",
        element: <ServiceDetail />,
      },
      {
        path: "/provider-landingpage/:id",
        element: <ProviderLandingPage />,
      },
      {
        path: "/subscription-provider",
        element: <Subscription />,
      },
      {
        path: "/user",
        element: (
          <RequireAuth>
            <ComHeaderUser>
              <Outlet />
            </ComHeaderUser>
          </RequireAuth>
        ),
        children: [
          {
            path: "/user/order-history",
            element: <OrderHistory />,
          },
          {
            path: "/user/addresses",
            element: <AddressesUser />,
          },
          {
            path: "/user/reset-password",
            element: <ResetPassword />,
          },
          {
            path: "/user/profile",
            element: <ProfilePage />,
          },
          {
            path: "/user/ticket",
            element: <TicketScreen />,
          },
          {
            path: "/user/create-ticket",
            element: <CreateTicket />,
          },
          {
            path: "/user/create-ticket-order",
            element: <CreateTicketOrder />,
          },
        ],
      },
      {
        path: "/cart",
        element: (
          <RequireAuth>
            <UserCart />
          </RequireAuth>
        ),
      },
      {
        path: "/checkout",
        element: (
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        ),
      },
      {
        path: "/checkout-service",
        element: (
          <RequireAuth>
            <CheckoutService />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/owner",
    element: (
      <RequireAuth>
        <ComHeaderOwner>
          <Outlet />
        </ComHeaderOwner>
      </RequireAuth>
    ),
    children: [
      {
        path: "/owner/*",
        element: <ErrorPage />,
      },
      {
        path: "/owner/service",
        element: <ServiceManager />,
      },
      {
        path: "/owner/service/create",
        element: <CreateSevice />,
      },
      {
        path: "/owner/service/:id",
        element: <DetailService />,
      },
      {
        path: "/owner/order",
        element: <OrderManager />,
      },
      {
        path: "/owner/order/:id",
        element: <OrderDetail />,
      },
      {
        path: "/owner/order/update/:id",
        element: <UpdateOrder />,
      },
      {
        path: "/owner/branch",
        element: <BranchManager />,
      },
      // {
      //   path: "/owner/branch/create",
      //   element: <CreateBranch />,
      // },
      {
        path: "/owner/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/owner/profile",
        element: <ProfilePage />,
      },
      {
        path: "/owner/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/owner/employee",
        element: <EmployeeManager />,
      },
      {
        path: "/owner/employee/:id",
        element: <EmployeeDetail />,
      },
      {
        path: "/owner/employee/create",
        element: <CreateEmployee />,
      },
      {
        path: "/owner/ticket",
        element: <TicketManager />,
      },
      // {
      //   path: "/owner/ticket/:id",
      //   element: <TicketDetail />,
      // },
      {
        path: "/owner/ticket/update/:id",
        element: <UpdateTicket />,
      },
    ],
  },
  {
    path: "/moderator",
    element: (
      <RequireAuth>
        <ComHeaderModerator>
          <Outlet />
        </ComHeaderModerator>
      </RequireAuth>
    ),
    children: [
      {
        path: "/moderator/*",
        element: <ErrorPage />,
      },
      {
        path: "/moderator/Feedback",
        element: <TableFeedback />,
      },
      {
        path: "/moderator/profile",
        element: <ProfilePage />,
      },
      {
        path: "/moderator/ticket",
        element: <TicketManager_Mod />,
      },
      {
        path: "/moderator/ticket/update/:id",
        element: <UpdateTicket_Mod />,
      },
      {
        path: "/moderator/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);
