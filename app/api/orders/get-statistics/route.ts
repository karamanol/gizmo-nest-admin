import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";
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
      productsInStockQuantity,
      reviewsQuantity,
      productsByAvgRating,
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
        { $limit: 5 },
      ]),
      Product.countDocuments({ soldout: false }),
      Review.countDocuments(),
      Product.find({ ratingsQuantity: { $gte: 2 } })
        .sort({ ratingsAverage: -1 })
        .limit(5),
    ]);

    return NextResponse.json({
      totalOrders,
      ordersToday,
      paidOrders,
      deliveredOrders,
      topFiveProducts: popularProducts,
      productsInStockQuantity,
      reviewsQuantity,
      productsByAvgRating,
    });
  } catch (err) {
    return Response.json({ error: getErrorMessage(err), status: 500 });
  }
}
