import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";
import { authOptions, isAdmin } from "../auth/[...nextauth]/route";

// export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await isAdmin(authOptions);
    await mongooseConnect();

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort");
    const page = parseInt(searchParams.get("page") || "1");

    const limit = 10;
    const skip = (page - 1) * limit;

    let sortObj = {};

    console.log("page", page);

    switch (sort) {
      case "new_first":
        sortObj = {
          updatedAt: -1, // -1 means order
        };
        break;
      case "old_first":
        sortObj = {
          updatedAt: 1,
        };
        break;
      case "paid_first":
        sortObj = {
          paid: -1,
          updatedAt: -1,
        };
        break;
      case "not_paid_first":
        sortObj = {
          paid: 1,
          updatedAt: -1,
        };
        break;
      case "delivered_first":
        sortObj = {
          delivered: -1,
          updatedAt: -1,
        };
        break;
      case "not_delivered_first":
        sortObj = {
          delivered: 1,
          updatedAt: -1,
        };
        break;
      default:
        sortObj = {
          updatedAt: -1, // -1 means order
        };
    }

    const orders = await Order.aggregate([
      {
        $sort: sortObj,
      },
      { $skip: skip },
      { $limit: limit + 1 },
      // limit +1 is set to get info on the client if there is at least one order to show on the next page,
      // otherwise, i had to make another separate request to get the count of orders in db
    ]);

    console.log(orders);
    return NextResponse.json(orders);
  } catch (err) {
    return Response.json({ error: getErrorMessage(err), status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await isAdmin(authOptions);
  await mongooseConnect();
  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");
    if (!_id) return Response.json({ status: 404, error: "Id not found" });

    await Order.findByIdAndDelete(_id);
    return Response.json({ status: 204 });
  } catch (err) {
    return Response.json({ error: getErrorMessage(err), status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await isAdmin(authOptions);
    await mongooseConnect();

    const body = await request.json();
    if (!body._id) throw new Error("Id not found");

    const updatedOrder = await Order.findByIdAndUpdate(
      body._id,
      {
        ...("paid" in body && { paid: body.paid }),
        ...("delivered" in body && { delivered: body.delivered }),
      },
      { new: true, runValidators: true }
    );
    return Response.json({ status: 200, data: updatedOrder });
  } catch (err) {
    return Response.json({ error: getErrorMessage(err), status: 500 });
  }
}
