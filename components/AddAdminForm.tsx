// "use client";

import { handleAddAdmin } from "@/actions/markUserAsAdmin";

function AddAdminForm() {
  return (
    <form action={handleAddAdmin} className="flex items-center mb-4">
      <input
        name="email"
        type="text"
        placeholder="user@example.com"
        className="border border-gray-400 rounded-md py-2 px-3 flex-1 !m-0 !mr-3"
      />
      <button type="submit" className="btn-primary font-semibold !py-2 !px-4 ">
        Mark as admin
      </button>
    </form>
  );
}

export default AddAdminForm;
