/**
 * Header component for Elderly Health Support System
 */

import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, isLoading, logout } = useAuth();
  const [notificationsCount] = useState(3); // This would come from API

  const navigation = [
    { name: "Trang chủ", href: "/", current: false },
    { name: "Sức khỏe", href: "/health", current: false },
    { name: "Thuốc", href: "/medications", current: false },
    { name: "Lịch hẹn", href: "/schedules", current: false },
    { name: "Tư vấn AI", href: "/chat", current: false },
  ];

  const userNavigation = [
    { name: "Hồ sơ cá nhân", href: "/profile", icon: UserCircleIcon },
    { name: "Cài đặt", href: "/settings", icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-elderly-border sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -ml-2 mr-2 p-2 rounded-md text-elderly-text hover:bg-elderly-hover-bg focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={onMenuClick}
              aria-label="Mở menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <HeartIcon className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-elderly-text hidden sm:block">
                  SứcKhỏe
                </span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:ml-8 lg:flex lg:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "nav-link",
                    item.current ? "nav-link-active" : "nav-link-inactive"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button
                  type="button"
                  className="relative p-2 text-elderly-text hover:bg-elderly-hover-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Thông báo"
                >
                  <BellIcon className="h-6 w-6" />
                  {notificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationsCount > 9 ? "9+" : notificationsCount}
                    </span>
                  )}
                </button>

                {/* User menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-elderly-hover-bg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-8 w-8 text-elderly-text-light" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-elderly-text">
                        {user.full_name || "Người dùng"}
                      </p>
                      <p className="text-xs text-elderly-text-light">
                        {user.email}
                      </p>
                    </div>
                  </Menu.Button>

                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex items-center px-4 py-3 text-sm",
                                  active
                                    ? "bg-elderly-hover-bg text-elderly-text"
                                    : "text-elderly-text-light"
                                )}
                              >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={cn(
                                "flex items-center w-full px-4 py-3 text-sm text-left",
                                active
                                  ? "bg-elderly-hover-bg text-elderly-text"
                                  : "text-elderly-text-light"
                              )}
                            >
                              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                              Đăng xuất
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              !isLoading && (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth/login"
                    className="text-elderly-text hover:text-primary-600 font-medium transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary">
                    Đăng ký
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="lg:hidden border-t border-elderly-border">
        <nav className="px-4 py-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                item.current
                  ? "bg-primary-100 text-primary-700"
                  : "text-elderly-text hover:bg-elderly-hover-bg"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
