import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import logo from "../../assets/images/Shoe Care Hub Logo_NoneBack.png";
import {
  Bars3Icon,
  BellIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  ChartPieIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Affix } from "antd";
import { PackageIcon, UserCircleIcon, ImageIcon, Network } from "lucide-react";
import { useStorage } from "../../hooks/useLocalStorage";
import { FaStar } from "react-icons/fa";
import ticketIcon from "../../assets/report.png";
import { TicketIcon } from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Trang chủ",
    href: "/admin/dashboard",
    icon: HomeIcon,
    current: false,
  },
  {
    name: "Người dùng",
    href: "/admin/user",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Thêm người điều hành",
    href: "/admin/moderator/create",
    icon: UserPlusIcon,
    current: false,
  },
  {
    name: "Doanh nghiệp",
    href: "/admin/store",
    icon: BuildingStorefrontIcon,
    current: false,
  },
  // {
  //   name: "Chi nhánh",
  //   href: "/admin/branch",
  //   icon: Network,
  //   current: false,
  // },
  {
    name: "Gói",
    href: "/admin/package",
    icon: PackageIcon,
    current: false,
  },
  {
    name: "Đánh giá",
    href: "/admin/feedback",
    icon: FaStar,
    current: false,
  },
  {
    name: "Danh mục dịch vụ",
    href: "/admin/service-category",
    icon: FolderIcon,
    current: false,
  },
  {
    name: "Danh mục khiếu nại",
    href: "/admin/ticket-category",
    icon: ExclamationTriangleIcon,
    current: false,
  },
  {
    name: "Khiếu nại",
    href: "/admin/ticket",
    icon: TicketIcon,
    current: false,
  },
  {
    name: "Giao dịch",
    href: "/admin/transaction",
    icon: ChartPieIcon,
    current: false,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: UserCircleIcon,
    current: false,
    children: [
      { name: "Hồ sơ của tôi", href: "/admin/profile" },
      { name: "Đổi mật khẩu", href: "/admin/reset-password" },
    ],
  },
];

const userNavigation = [
  { name: "Hồ sơ của tôi", href: "/admin/profile" },
  { name: "Đăng xuất", href: "/login" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComHeaderAdmin({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeCategory, setActiveCategory] = useState(null);
  const [user, setUser, loadUser] = useStorage("user", null);
  const navigate = useNavigate();
  const [token, setToken, loadToken] = useStorage("token", "");

  useEffect(() => {
    setActiveCategory(currentPath);
    window.scrollTo(0, 0);
  }, [currentPath]);
  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-white/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="false"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-4 pb-4 ring-1 ring-white/10 border-r">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src={logo}
                    className="h-18 w-auto mt-5"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            {!item.children ? (
                              <Link
                                to={item.href}
                                className={classNames(
                                  item.href === activeCategory
                                    ? "bg-gray-50 text-[#002278]"
                                    : "hover:bg-gray-50  hover:text-[#002278] text-[#4A4C56]",
                                  "block  rounded-md py-2 pl-10 pr-2 text-sm font-semibold leading-6"
                                )}
                              >
                                <div className="flex gap-2">
                                  <item.icon
                                    aria-hidden="true"
                                    className="h-6 w-6 shrink-0"
                                  />
                                  {item.name}
                                </div>
                              </Link>
                            ) : (
                              <Disclosure as="div">
                                <DisclosureButton
                                  className={classNames(
                                    item.href === activeCategory
                                      ? "bg-gray-50 text-[#002278]"
                                      : "hover:bg-gray-50  hover:text-[#002278] text-[#4A4C56]",
                                    "group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700"
                                  )}
                                >
                                  <ChevronRightIcon
                                    aria-hidden="true"
                                    className="h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                                  />
                                  <item.icon
                                    aria-hidden="true"
                                    className="h-6 w-6 shrink-0"
                                  />
                                  {item.name}
                                </DisclosureButton>
                                <DisclosurePanel as="ul" className="mt-1">
                                  {item.children.map((subItem) => (
                                    <li key={subItem.name}>
                                      <Link
                                        as="a"
                                        to={subItem.href}
                                        className={classNames(
                                          subItem.href === activeCategory
                                            ? "bg-gray-50 text-[#002278]"
                                            : "hover:bg-gray-50  hover:text-[#002278] text-[#4A4C56]",
                                          "block rounded-md py-2 pl-9 pr-2 text-sm leading-6 my-2"
                                        )}
                                      >
                                        {subItem.name}
                                      </Link>
                                    </li>
                                  ))}
                                </DisclosurePanel>
                              </Disclosure>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>

                    <li className="mt-auto">
                      <a
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0"
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-56 lg:flex-col border-r">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-4 pb-4">
            <div className="flex h-16 shrink-0 items-center justify-center">
              <img alt="Your Company" src={logo} className="h-18 w-auto mt-5" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        {!item.children ? (
                          <Link
                            to={item.href}
                            className={classNames(
                              item.href === activeCategory
                                ? "bg-gray-50 text-[#002278]"
                                : "hover:bg-gray-50  hover:text-[#002278] text-[#4A4C56]",
                              "block  rounded-md py-3 pl-10 pr-2 text-sm font-semibold leading-6 "
                            )}
                          >
                            <div className="flex gap-2">
                              <item.icon
                                aria-hidden="true"
                                className="h-6 w-6 shrink-0"
                              />
                              {item.name}
                            </div>
                          </Link>
                        ) : (
                          <Disclosure as="div">
                            <DisclosureButton
                              className={classNames(
                                item.href === activeCategory
                                  ? "bg-gray-50 text-[#002278]"
                                  : "hover:bg-gray-50  hover:text-[#002278] text-[#4A4C56]",
                                "group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700 py-3"
                              )}
                            >
                              <ChevronRightIcon
                                aria-hidden="true"
                                className="h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                              />
                              <item.icon
                                aria-hidden="true"
                                className="h-6 w-6 shrink-0"
                              />
                              {item.name}
                            </DisclosureButton>
                            <DisclosurePanel as="ul" className="mt-1 ">
                              {item.children.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    as="a"
                                    to={subItem.href}
                                    className={classNames(
                                      subItem.href === activeCategory
                                        ? "bg-gray-50 text-[#002278]"
                                        : "hover:bg-gray-50  hover:text-[#002278] text-[#4A4C56]",
                                      "block rounded-md py-2 pl-9 pr-2 text-sm leading-6 my-2"
                                    )}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </DisclosurePanel>
                          </Disclosure>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Cog6ToothIcon
                      aria-hidden="true"
                      className="h-6 w-6 shrink-0"
                    />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-56 ">
          <Affix offsetTop={0}>
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white  px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden "
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6 text-black" />
              </button>

              {/* Separator */}
              <div
                aria-hidden="true"
                className="h-6 w-px bg-white/10 lg:hidden"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form action="#" method="GET" className="relative flex flex-1">
                  {/* <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  />
                  <input
                    id="search-field"
                    name="search"
                    type="search"
                    placeholder="Search..."
                    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-wbg-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  /> */}
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                  </button>

                  {/* Separator */}
                  <div
                    aria-hidden="true"
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10"
                  />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <MenuButton className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src={user?.imageUrl}
                        className="h-8 w-8 rounded-full bg-gray-50"
                      />
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          aria-hidden="true"
                          className="ml-4 text-sm font-semibold leading-6 text-black"
                        ></span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="ml-2 h-5 w-5 text-gray-400"
                        />
                      </span>
                    </MenuButton>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-wbg-white/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          {item.name === "Đăng xuất" ? (
                            <button
                              onClick={() => {
                                setToken(""); // Gọi hàm để xoá token khi người dùng chọn "Đăng xuất"
                                setTimeout(() => {
                                  navigate("/login");
                                }, 300);
                              }}
                              className="block px-3 py-1 text-sm leading-6 text-wbg-white data-[focus]:bg-gray-50"
                            >
                              {item.name}
                            </button>
                          ) : (
                            <Link
                              to={item.href}
                              className="block px-3 py-1 text-sm leading-6 text-wbg-white data-[focus]:bg-gray-50"
                            >
                              {item.name}
                            </Link>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>
          </Affix>

          <main className="py-2  bg-[#f9f9fc] min-h-[calc(100vh-64px)]">
            <div className="sm:px-6 lg:px-2">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
