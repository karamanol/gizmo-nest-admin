"use client";
import { signIn } from "next-auth/react";

function AuthButton() {
  return (
    <div className="flex flex-col max-w-2xl justify-center text-gray-900">
      <p className="text-xl mb-8">Welcome to GizmoNest Admin Site!</p>
      <span className="mb-3">
        This platform is designed for administrators to manage the GizmoNest
        website. For demonstrational purposes, site is opened for everyone to
        explore.
      </span>
      <span>
        {` Please note, if you're `}
        <span className="font-semibold">{`not an admin`}</span>
        {`, you will be in `}
        <span className="font-semibold">{`'Read-Only'`}</span>
        {` mode.
        This means you can view all the possible operations, but you won't be able to
        make any changes`}
      </span>
      <span className="mb-5">Enjoy your visit!</span>
      <button
        onClick={() => signIn()}
        className="bg-teal-600 drop-shadow-md hover:bg-teal-600/80 transition-all text-gray-800 rounded-full px-6 py-2 shadow-sm max-w-xs mx-auto">
        Sign in with Google or Github
      </button>
    </div>
  );
}

export default AuthButton;
