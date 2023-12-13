import { NextRequest } from "next/server";
import { authOptions, isAdmin } from "../../auth/[...nextauth]/route";
import { mongooseConnect } from "@/lib/mongoose";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Order } from "@/models/Order";

export async function DELETE(request: NextRequest) {
  await isAdmin(authOptions);
  await mongooseConnect();
  try {
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
