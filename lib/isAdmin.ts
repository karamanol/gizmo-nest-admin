import { Types } from "mongoose";
import { mongooseConnect } from "./mongoose";
import { AuthOptions, getServerSession } from "next-auth";
import AdminUser from "@/models/AdminUser";

export type AdminUserType = {
  _id: Types.ObjectId;
  email: string;
};
export const isAdmin = async (authOpt: AuthOptions) => {
  await mongooseConnect();
  const session = await getServerSession(authOpt);
  const admins: Array<AdminUserType> = await AdminUser.find();
  const adminEmails = admins.map((admin) => admin.email);

  if (!adminEmails.includes(session?.user?.email as string)) {
    throw new Error("You must be an admin to do that action");
  }
};
