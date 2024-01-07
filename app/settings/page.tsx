import { mongooseConnect } from "@/lib/mongoose";
import AdminUser from "@/models/AdminUser";
import AddAdminForm from "@/components/AddAdminForm";
import {
  AdminUserType,
  authOptions,
  isAdmin,
} from "../api/auth/[...nextauth]/route";
import { Types } from "mongoose";
import RemoveAdminButton from "@/components/RemoveAdminButton";
import { revalidatePath } from "next/cache";
import { removeAdmin } from "@/actions/removeAdmin";

async function SettingsPage() {
  await mongooseConnect();
  const admins: AdminUserType[] = await AdminUser.find();

  return (
    <div className="p-4">
      <h2 className="text-xl text-gray-900 font-semibold mb-4">
        Give to user an admin rights:
      </h2>

      <AddAdminForm />

      <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">
        List of Admins:
      </h2>
      <ul className="flex flex-col pl-4 ">
        {admins.map((admin) => (
          <li
            key={admin._id.toString()}
            className="flex justify-between items-center admin-list-item mb-2 pb-2">
            <span>{admin.email}</span>
            <RemoveAdminButton
              adminId={admin._id.toString()}
              adminsAmount={admins?.length || 1}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SettingsPage;
