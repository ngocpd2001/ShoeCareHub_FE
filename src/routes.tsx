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
import ChangePassword from "./page/ResetPassword/ChangePassword";
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
import TableFeedback from "./page/Moderator/FeedbackManager/TableFeedback";
import ComHeaderModerator from './Components/ComHeaderModerator/ComHeaderModerator';
import EmailVerificationFailedScreen from "./page/EmailVerificationFailed/EmailVerificationFailedScreen";
import TicketManager_Mod from "./page/Moderator/Ticket_Mod/TicketManager_Mod";
import UpdateTicket_Mod from "./page/Moderator/Ticket_Mod/UpdateTicket_Mod";
import ErrorPage_Owner from "./page/404/ErrorPage_Owner";
import ErrorPage_Mod from "./page/404/ErrorPage_Mod";
import ErrorPage_Emp from "./page/404/ErrorPage_Emp";
import ComHeaderEmployee from "./Components/ComHeaderEmployee/ComHeaderEmployee";
import Dashboard_Emp from "./page/Employee/Dashboard_Emp";
import ServiceManager_Emp from "./page/Employee/Service/ServiceManager_Emp";
import DetailService_Emp from "./page/Employee/Service/DetailService_Emp";
import OrderManager_Emp from "./page/Employee/Order/OrderManager_Emp";
import FeedbackManager_Emp from "./page/Employee/Feedback/FeedbackManager_Emp";
import DetailFeedback_Emp from "./page/Employee/Feedback/DetailFeedback_Emp";
import TicketManager_Emp from "./page/Employee/Ticket/TicketManager_Emp";
import FeedbackManager from "./page/Owner/Feedback/FeedbackManager";
import ErrorPage_Admin from "./page/404/ErrorPage_Admin";
import UserManager from "./page/Admin/User/UserManager";
import CreateModerator from "./page/Admin/User/CreateModerator";
import ResetPassword from "./page/ResetPassword/ResetPassword";
import ResetPasswordSuccess from "./page/ResetPassword/ResetPasswordSuccess";
import UpdateUser from "./page/Admin/User/UpdateUser";
import BusinessManager from "./page/Admin/Business/BusinessManager";
import UpdateBusiness from "./page/Admin/Business/UpdateBusiness";
import UpdateBranch_Ad from "./page/Admin/Branch/UpdateBranch_Ad";
import CategoryTicketManager from "./page/Admin/CategoryTicket/CategoryTicketManager";
import UpdateTicket_Ad from "./page/Admin/Ticket/UpdateTicket_Ad";
import TicketManager_Ad from "./page/Admin/Ticket/TicketManager_Ad";
import Package from "./page/Owner/Package/Package";
import PaymentSuccess from "./page/Owner/Package/PaymentSuccess";
import PaymentFailed from "./page/Owner/Package/PaymentFailed";
import MaterialManager from "./page/Owner/Material/MaterialManager";
import UpdateMaterial from "./page/Owner/Material/UpdateMaterial";
import CreateMaterial from "./page/Owner/Material/CreateMaterial";
import ProviderPage from "./page/Provider/ProviderPage";
import TransactionManager from "./page/Admin/Transaction/TransactionManager";
import CategoryServiceManager from "./page/Admin/CategoryService/CategoryServiceManager";
import PackageManager from "./page/Admin/package/PackageManager";
import ProfileBusiness from "./page/ProfileUser/ProfileBusiness";
import RegisterCustomerToOwner from "./page/Register/RegisterCustomerToOwner";

// Component bảo vệ route
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const token = localStorage.getItem("token")?.replace(/^["']|["']$/g, "").trim();

  if (!token || !isValidToken(token)) {
    console.log("Redirecting to login due to invalid or missing token.");
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const routers = createBrowserRouter([
  {
    path: "/",
    element: (
      <ComHeader>
        <Outlet />
      </ComHeader>
    ),
    children: [
      {
        path: "*",
        element: <ErrorPage />,
      },
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
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/request-reset-password",
        element: <ResetPasswordSuccess />,
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
            path: "/user/register-owner",
            element: <RegisterCustomerToOwner />,
          },
          {
            path: "/user/addresses",
            element: <AddressesUser />,
          },
          {
            path: "/user/reset-password",
            element: <ChangePassword />,
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
      {
        path: "/provider",
        element: <ProviderPage />,
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
        path: "/owner/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/owner/*",
        element: <ErrorPage_Owner />,
      },
      {
        path: "/owner/service",
        element: <ServiceManager />,
      },
      {
        path: "/owner/package",
        element: <Package />,
      },
      {
        path: "/owner/payments/success",
        element: <PaymentSuccess />,
      },
      {
        path: "/owner/payments/fail",
        element: <PaymentFailed />,
      },
      {
        path: "/owner/feedback",
        element: <FeedbackManager />,
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
        path: "/owner/profile",
        element: <ProfilePage />,
      },
      {
        path: "/owner/business",
        element: <ProfileBusiness />,
      },
      {
        path: "/owner/reset-password",
        element: <ChangePassword />,
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
      {
        path: "/owner/material",
        element: <MaterialManager />,
      },
      {
        path: "/owner/material/update/:id",
        element: <UpdateMaterial />,
      },
      {
        path: "/owner/material/create",
        element: <CreateMaterial />,
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
        element: <ErrorPage_Mod />,
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
        element: <ChangePassword />,
      },
    ],
  },
  {
    path: "/employee",
    element: (
      <RequireAuth>
        <ComHeaderEmployee>
          <Outlet />
        </ComHeaderEmployee>
      </RequireAuth>
    ),
    children: [
      {
        path: "/employee/*",
        element: <ErrorPage_Emp />,
      },
      {
        path: "/employee/service",
        element: <ServiceManager_Emp />,
      },
      {
        path: "/employee/service/:id",
        element: <DetailService_Emp />,
      },
      {
        path: "/employee/feedback",
        element: <FeedbackManager_Emp />,
      },
      // {
      //   path: "/employee/feedback/:id",
      //   element: <DetailFeedback_Emp />,
      // },
      {
        path: "/employee/dashboard",
        element: <Dashboard_Emp />,
      },
      {
        path: "/employee/profile",
        element: <ProfilePage />,
      },
      {
        path: "/employee/ticket",
        element: <TicketManager_Emp />,
      },
      {
        path: "/employee/ticket/update/:id",
        element: <UpdateTicket />,
      },
      {
        path: "/employee/reset-password",
        element: <ChangePassword />,
      },
      {
        path: "/employee/order",
        element: <OrderManager_Emp />,
      },
      {
        path: "/employee/order/update/:id",
        element: <UpdateOrder />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <ComHeaderAdmin>
          <Outlet />
        </ComHeaderAdmin>
      </RequireAuth>
    ),
    children: [
      {
        path: "/admin/*",
        element: <ErrorPage_Admin />,
      },
      {
        path: "/admin/profile",
        element: <ProfilePage />,
      },
      {
        path: "/admin/reset-password",
        element: <ChangePassword />,
      },
      {
        path: "/admin/user",
        element: <UserManager />,
      },
      {
        path: "/admin/moderator/create",
        element: <CreateModerator />,
      },
      {
        path: "/admin/user/update/:id",
        element: <UpdateUser />,
      },
      {
        path: "/admin/store",
        element: <BusinessManager />,
      },
      {
        path: "/admin/store/update/:id",
        element: <UpdateBusiness />,
      },
      {
        path: "/admin/branch/update/:id",
        element: <UpdateBranch_Ad />,
      },
      {
        path: "/admin/ticket-category",
        element: <CategoryTicketManager />,
      },
      {
        path: "/admin/ticket",
        element: <TicketManager_Ad />,
      },
      {
        path: "/admin/ticket/update/:id",
        element: <UpdateTicket_Ad />,
      },
      {
        path: "/admin/transaction",
        element: <TransactionManager />,
      },
      {
        path: "/admin/feedback",
        element: <TableFeedback />,
      },
      {
        path: "/admin/service-category",
        element: <CategoryServiceManager />,
      },
      {
        path: "/admin/package",
        element: <PackageManager />,
      },
    ],
  },
]);
