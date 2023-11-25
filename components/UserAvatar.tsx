"use client";

import Image from "next/image";
import defaultImage from "../public/default_avatar.jpeg";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/cn";
import Swal from "sweetalert2";

type UserAvatarProps = {
  className: string;
};

function UserAvatar({ className }: UserAvatarProps) {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div
      className={cn(
        "flex gap-2 items-center mt-auto flex-col sm:flex-row",
        className
      )}>
      <Image
        src={session?.user?.image ?? defaultImage}
        width={30}
        height={30}
        alt="user image"
        className="hidden sm:block"
      />
      <span className="hidden sm:inline-block">{session.user?.name}</span>
      <button
        className="sm:ml-auto hover:scale-110"
        onClick={() =>
          Swal.fire({
            title: `Log out from ${session.user?.name} account?`,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Yes!",
            confirmButtonColor: "#e11d48",
            animation: false,
          }).then((result) => {
            if (result.isConfirmed) {
              (async () => {
                await signOut({ callbackUrl: "/" }); // also redirect back to root page
              })();
            }
          })
        }>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 ">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </button>
    </div>
  );
}

export default UserAvatar;
