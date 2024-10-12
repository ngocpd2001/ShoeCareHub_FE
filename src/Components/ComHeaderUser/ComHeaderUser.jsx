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
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link, useLocation } from "react-router-dom";
import { Affix } from "antd";

const navigation = [
  {
    name: "Tài khoản",
    icon: UsersIcon,
    current: false,
    children: [
      { name: "Thông tin tài khoản", href: "/user/profile" },
      { name: "Đổi mật khẩu", href: "/" },
      { name: "Địa chỉ nhận hàng", href: "/", current: true },
      { name: "trở thành nhà cung cấp", href: "/" },
      { name: "Sản phẩm yêu thích", href: "/" },
    ],
  },
  {
    name: "Lịch sử mua hàng",
    icon: UsersIcon,
    current: false,
    children: [{ name: "Đơn hàng", href: "/user/OrderHistory" }],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComHeaderUser({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    setActiveCategory(currentPath);
    window.scrollTo(0, 0);
  }, [currentPath]);
  return (
    <div className="max-w-[1250px] m-auto">
      <div className="flex  w-full mt-2 ">
        <div className=" w-56 ">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-4 pb-4 bg-white ">
            <div className="flex h-16 gap-2 shrink-0 items-center justify-center">
              <img
                alt="Your Company"
                src="/static/media/Shoe%20Care%20Hub%20Logo_NoneBack.c5ffe0b9434c3d34dd6e.png"
                className="h-16 w-auto"
              />
              Phan Văn A
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
                                : "hover:bg-gray-50 hover:text-[#002278] text-black",
                              "block rounded-md py-2 pl-10 pr-2 text-sm font-semibold leading-6"
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
                          <Disclosure as="div" defaultOpen={true}>
                            <DisclosureButton
                              className={classNames(
                                item.href === activeCategory
                                  ? "bg-gray-50 text-[#002278]"
                                  : "hover:bg-gray-50 hover:text-[#002278] text-black",
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
                                        ? " text-[#002278]"
                                        : " hover:text-[#002278] text-black",
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
              </ul>
            </nav>
          </div>
        </div>

        <section
          aria-labelledby="products-heading"
          className="px-4 pt-2 sm:px-6 lg:px-8 flex-1"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-6 ">
            <div className="lg:col-span-6  h-full w-full">
              <div className="">{children}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
