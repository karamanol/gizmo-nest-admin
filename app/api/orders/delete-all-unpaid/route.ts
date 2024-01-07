import { NextRequest } from "next/server";
import { authOptions, isAdmin } from "../../auth/[...nextauth]/route";
import { mongooseConnect } from "@/lib/mongoose";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest) {
  try {
    await mongooseConnect();
    await isAdmin(authOptions);
    await Order.deleteMany({ paid: false });
    return Response.json({ status: 204, success: "success" });
  } catch (err) {
    return Response.json({
      error: getErrorMessage(err),
      status: 500,
      success: "fail",
    });
  }
}
