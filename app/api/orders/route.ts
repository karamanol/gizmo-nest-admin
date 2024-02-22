import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/isAdmin";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

const sortingOptions = {
  new_first: {
    updatedAt: -1,
  },
  old_first: {
    updatedAt: 1,
  },
  paid_first: {
    paid: -1,
    updatedAt: -1,
  },
  not_paid_first: {
    paid: 1,
    updatedAt: -1,
  },
  delivered_first: {
    delivered: -1,
    updatedAt: -1,
  },
  not_delivered_first: {
    delivered: 1,
    updatedAt: -1,
  },
  default: {
    updatedAt: -1,
  },
};

export async function GET(request: NextRequest) {
  try {
    await mongooseConnect();
    // await isAdmin(authOptions);

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "";
    const page = parseInt(searchParams.get("page") || "1");

    const limit = 10;
    const skip = (page - 1) * limit;

    const sortObj =
      //@ts-ignore
      sort in sortingOptions ? sortingOptions[sort] : sortingOptions["default"];

    const orders = await Order.aggregate([
      {
        $sort: sortObj,
      },
      { $skip: skip },
      { $limit: limit + 1 },
      // limit +1 is set to get info on the client if there is at least one order to show on the next page,
      // otherwise, i had to make another separate request to get the count of orders in db
    ]);

    return NextResponse.json(orders);
  } catch (err) {
    return Response.json({ error: getErrorMessage(err), status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await mongooseConnect();
  await isAdmin(authOptions);
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
    await mongooseConnect();
    await isAdmin(authOptions);

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
