import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await mongooseConnect();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      ordersToday,
      paidOrders,
      deliveredOrders,
      popularProducts,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ paid: true }),
      Order.countDocuments({ delivered: true }),
      Order.aggregate([
        { $unwind: "$orderedProducts" },
        {
          $group: {
            _id: "$orderedProducts.name",
            totalQuantity: { $sum: "$orderedProducts.quantity" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 3 },
      ]),
    ]);

    return NextResponse.json({
      totalOrders,
      ordersToday,
      paidOrders,
      deliveredOrders,
      topThreeProducts: popularProducts,
    });
  } catch (err) {
    return Response.json({ error: getErrorMessage(err), status: 500 });
  }
}
