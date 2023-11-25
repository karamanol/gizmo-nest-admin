"use client";

import Image from "next/image";
import logo192 from "../public/android-chrome-192x192.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/cn";

function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <aside className=" flex flex-col p-1 sm:p-4 text-gray-800 sm:min-w-[14rem] ">
        <Link href={"/"} className="flex items-center gap-2 mb-5">
          <Image
            src={logo192}
            alt="gizmo logo"
            width={40}
            height={40}
            className="scale-75  sm:scale-100  "
          />
          <span className="text-slate-800 font-semibold absolute sm:static -translate-x-[200%] sm:translate-x-0  ">
            GizmoNestAdmin
          </span>
        </Link>

        <nav className="flex flex-col gap-4 text-xl">
          <Link
            href={"/"}
            className={cn(
              "sm:justify-start justify-center",
              pathname === "/" ? "activeLink" : "inactiveLink"
            )}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span className="-translate-x-[200%] sm:translate-x-0   absolute sm:static">
              Dashboard
            </span>
          </Link>

          <Link
            href={"/products"}
            className={cn(
              "sm:justify-start justify-center",
              pathname.includes("/products") ? "activeLink" : "inactiveLink"
            )}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
              />
            </svg>
            <span className="-translate-x-[200%] sm:translate-x-0   absolute sm:static">
              Products
            </span>
          </Link>
          <Link
            href={"/categories"}
            className={cn(
              "sm:justify-start justify-center",
              pathname.includes("/categories") ? "activeLink" : "inactiveLink"
            )}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
              />
            </svg>
            <span className="-translate-x-[200%] sm:translate-x-0   absolute sm:static">
              Categories
            </span>
          </Link>

          <Link
            href={"/orders"}
            className={cn(
              "sm:justify-start justify-center",
              pathname.includes("/orders") ? "activeLink" : "inactiveLink"
            )}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="-translate-x-[200%] sm:translate-x-0   absolute sm:static">
              Orders
            </span>
          </Link>
          <Link
            href={"/settings"}
            className={cn(
              "sm:justify-start justify-center",
              pathname.includes("/settings") ? "activeLink" : "inactiveLink"
            )}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
              />
            </svg>
            <span className="-translate-x-[200%] sm:translate-x-0   absolute sm:static">
              Settings
            </span>
          </Link>
        </nav>
        <UserAvatar className="mt-auto mb-3" />
      </aside>
    </>
  );
}

export default Navigation;
