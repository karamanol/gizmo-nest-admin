"use client";
import { signIn } from "next-auth/react";

function AuthButton() {
  return (
    <button
      onClick={() => signIn()}
      className="bg-teal-600 drop-shadow-md hover:bg-teal-600/80 transition-all text-gray-800 rounded-full px-4 py-2 shadow-sn">
      Sign in with Google or Github
    </button>
  );
}

export default AuthButton;
