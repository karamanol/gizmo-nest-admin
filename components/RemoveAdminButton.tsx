"use client";

import { removeAdmin } from "@/actions/removeAdmin";
import toast from "react-hot-toast";

type RemoveAdminButtonProps = {
  adminId: string;
  adminsAmount: number;
};

function RemoveAdminButton({ adminId, adminsAmount }: RemoveAdminButtonProps) {
  // wrapper that helps to show server error on client
  const clientAction = async (adminId: string, adminsAmount: number) => {
    const errObj = await removeAdmin(adminId, adminsAmount);
    if (errObj?.error) toast.error(errObj.error);
  };

  return (
    <button
      onClick={() => clientAction(adminId, adminsAmount)}
      className="btn-delete font-semibold !py-2 !px-4  hover:bg-red-500 transition-colors ">
      Remove rights
    </button>
  );
}

export default RemoveAdminButton;
