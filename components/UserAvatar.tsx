"use client";

import Image from "next/image";
import defaultImage from "../public/default_avatar.jpeg";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/cn";

type UserAvatarProps = {
  className: string;
};

function UserAvatar({ className }: UserAvatarProps) {
  const { data: session } = useSession();
  if (!session) return null;

  return (
    <div className={cn("flex gap-2 items-center mt-auto", className)}>
      <Image
        src={session?.user?.image ?? defaultImage}
        width={30}
        height={30}
        alt="user image"
      />
      <span>{session.user?.name}</span>
    </div>
  );
}

export default UserAvatar;
