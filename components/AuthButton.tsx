"use client";
import { useSession, signIn, signOut } from "next-auth/react";

function AuthButton() {


  
  return (
    <button
      onClick={() => signIn()}
      className="bg-blue-500 rounded-full px-4 py-2 shadow-sn">
      Sign in with Google or Github
    </button>
  );
}

export default AuthButton;
