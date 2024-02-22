"use server";

import { authOptions } from "@/lib/authOptions";
import { isAdmin } from "@/lib/isAdmin";
import { mongooseConnect } from "@/lib/mongoose";
import AdminUser from "@/models/AdminUser";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { revalidatePath } from "next/cache";

export const removeAdmin = async (id: string, adminsQuantity: number) => {
  try {
    await mongooseConnect();
    await isAdmin(authOptions);
    if (adminsQuantity === 1)
      throw new Error("At least one admin needs to remain");
    await AdminUser.findByIdAndDelete(id);
    revalidatePath("/settings");
  } catch (err) {
    return { error: getErrorMessage(err) };
  }
};
