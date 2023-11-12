"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="">
      <h2>
        Hello, <span className="font-semibold">{session?.user?.name}</span>
      </h2>
    </div>
  );
}
