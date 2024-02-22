"use server";

import { authOptions } from "@/lib/authOptions";
import { isAdmin } from "@/lib/isAdmin";
import { mongooseConnect } from "@/lib/mongoose";
import AdminUser from "@/models/AdminUser";
import { isValidEmail } from "@/utils/isValidEmail";
import { revalidatePath } from "next/cache";

export const handleAddAdmin = async (formData: FormData) => {
  const email = formData.get("email");
  if (!email || !isValidEmail(email.toString()))
    throw new Error("Invalid email format");
  await mongooseConnect();
  await isAdmin(authOptions);
  await AdminUser.create({ email });
  revalidatePath("/settings");
};
