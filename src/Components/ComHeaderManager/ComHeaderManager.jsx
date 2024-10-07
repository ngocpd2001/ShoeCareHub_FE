import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  QueueListIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Affix, Badge, Space } from "antd";
import { BellOutlined, MenuOutlined } from "@ant-design/icons";
import {
  BuildingOffice2Icon, // Quản lý viện (Ví dụ)
  UserIcon, // Quản lý khách hàng (Ví dụ)
  UsersIcon, // Quản lý người cao tuổi (Ví dụ)
  BriefcaseIcon, // Quản lý nhân viên (Ví dụ)
  Cog6ToothIcon, // Quản lý tài khoản (Ví dụ)
  WrenchScrewdriverIcon, // Quản lý dịch vụ (Ví dụ)
  ClockIcon, // Quản lý thời gian (Ví dụ)
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";
import ErrorPage from "../../page/404/ErrorPage";
import { getData } from "../../api/api";
import { useStorage } from "../../hooks/useLocalStorage";
const sortOptions = [
  { name: "Thông tin", href: "profile" },
  { name: "Thay đổi mật khẩu", href: "password" },
  { name: "Đăng xuất", href: "login" },
];
const subCategories = [
  {
    name: "Quản lý viện",
    href: "/manager/institute",
    icon: BuildingOffice2Icon,
  },
  { name: "Khách hàng", href: "/manager/user", icon: UserIcon },
  { name: "Người cao tuổi", href: "/manager/elder", icon: UsersIcon },
  { name: "Nhân viên", href: "/manager/employee", icon: BriefcaseIcon },
  {
    name: "Lịch hẹn",
    href: "/manager/appointmentSchedule",
    icon: CalendarDaysIcon,
  },
  {
    name: "Quản lý gói dưỡng lão",
    href: "/manager/nursingPackage",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Quản lý dịch vụ",
    href: "/manager/servicePackage",
    icon: Bars3Icon,
  },
];

export default function ComHeaderManager({ children }) {
  const [mobileFiltersOpen, setMobileHeadersOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const [userData, setUserData] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [role, setRole, loadStoredValue] = useStorage("role", null);
  const navigate = useNavigate();
  useEffect(() => {
    setActiveCategory(currentPath);
    window.scrollTo(0, 0);
    loadStoredValue();
  }, [currentPath]);
  function findNameByPathname() {
    const matchingCategory = subCategories.find(
      (category) => category.href === currentPath
    );
    return matchingCategory ? matchingCategory.name : null;
  }
  const handSend = (option) => {
    switch (option) {
      case "login":
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        //localStorage.clear(); // xóa tất cả
        setTimeout(() => {
          navigate("/login");
        }, 0);
        break;
      case "profile":
        navigate("/manager/profile");
        break;
      case "password":
        navigate("/manager/changePassword");
        break;
      default:
        navigate(option);
        break;
    }
  };
  const getAPI = () => {
    getData("/users/profile")
      .then((response) => {
        setUserData(response?.data);
      })
      .catch((er) => {
        console.error("Error fetching items:", er);
      });
  };
  useEffect(() => {
    getAPI();
  }, []);
  if (role !== "Manager") {
    return <ErrorPage goTo={"/"} statusCode={"404"} />;
  }
  return (
    <div className="bg-[#f9fafb] flex">
      <Affix offsetTop={0} className="hidden lg:block fixed-sidebar ">
        <div className="bg-[#0F296D] h-screen w-[260px]  pr-2 overflow-y-auto pb-4">
          <div className="text-white px-10 py-4 text-center text-3xl">
            Shoe Care Hub
          </div>
          <div className="text-white flex flex-col gap-5">
            {subCategories.map((category) => (
              <Link
                to={category.href}
                key={category.name}
                className={`${
                  category?.href === activeCategory
                    ? "bg-white rounded-r-full"
                    : "hover:bg-gray-200 hover:rounded-r-full hover:text-[#0F296D] "
                } p-3 flex items-center cursor-pointer`}
                onClick={() => {
                  // setActiveCategory(category.href);
                  // navigate(category.href);
                }}
              >
                <category.icon
                  className={`h-6 w-6 mr-2 ${
                    category?.href === activeCategory
                      ? "text-[#0F296D] hover:text-[#0F296D]"
                      : "text-whitehover:text-[#0F296D]"
                  }`}
                  aria-hidden="true"
                />
                <h1
                  className={`${
                    category?.href === activeCategory ? "text-[#0F296D]" : ""
                  } font-bold text-base`}
                >
                  {category.name}
                </h1>
              </Link>
            ))}
          </div>
        </div>
      </Affix>
      <div className="w-full">
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileHeadersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Shoe Care Hub
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileHeadersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Header */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Shoe Care Hub</h3>
                    <ul
                      role="list"
                      className="px-2 py-3 font-medium text-gray-900 scrollbar scrollbar-thin"
                    >
                      {subCategories.map((category) => (
                        <li key={category.name}>
                          <Link to={category.href} className="block px-2 py-3">
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        <Affix offsetTop={0} className="w-full sticky top-0 z-30">
          <div className="bg-white flex items-center justify-between border-b border-gray-200 h-17">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 px-3">
              {/* đổi Tên */}
              {findNameByPathname()}
            </h1>

            <div className="flex items-center">
              <Space size="large">
                {/* <Badge count={0} overflowCount={9}>
                  <BellOutlined
                    style={{ fontSize: "30px" }}
                    onClick={() => navigate("/manager/notification")}
                  />
                </Badge> */}
                <div className="text-lg">{userData?.fullName}</div>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="h-11 w-11 group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      {userData && userData.avatarUrl ? (
                        <img
                          className="h-10 w-10 rounded-full border border-gray-400 justify-center items-center mt-2"
                          src={userData.avatarUrl}
                          alt=""
                        />
                      ) : (
                        <div className="bg-white">
                          <UserCircleIcon className="h-10 w-10" />
                        </div>
                      )}
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 w-40 origin-top-right rounded-lg bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border-b-slate-300 border">
                      <div>
                        {sortOptions.map((option) => (
                          <Menu.Item key={option.name}>
                            <div
                              onClick={() => handSend(option.href)}
                              className="block px-4 py-2 text-sm cursor-pointer text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rounded-lg"
                            >
                              {option.name}
                            </div>
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button
                  type="button"
                  className="-m-2 ml-1 p-2 text-gray-400 hover:text-gray-500 sm:ml-2 lg:hidden"
                  onClick={() => setMobileHeadersOpen(true)}
                >
                  <span className="sr-only">Menu</span>
                  {/* <MenuFoldOutlined /> */}
                  <MenuOutlined
                    className="h-7 w-7 text-black"
                    aria-hidden="true"
                  />
                </button>
              </Space>
            </div>
          </div>
        </Affix>

        <section
          aria-labelledby="products-heading"
          className="px-4 pt-2 sm:px-6 lg:px-8 "
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-6 ">
            <div className="lg:col-span-6  h-full w-full">
              {/* <div className="lg:w-[calc(100vw-350px)] w-[calc(100vw-70px)]"> */}
              <div className="">
                {/* {user?.role === "admin" ? (
                  children
                ) : (
                  <ErrorPage goTo={"/"} statusCode={"404"} />
                )} */}
                {children}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
