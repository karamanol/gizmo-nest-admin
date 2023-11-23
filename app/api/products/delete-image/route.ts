import { mongooseConnect } from "@/lib/mongoose";
import supabase from "@/lib/supabase";
import { Product } from "@/models/Product";
import { MongooseError } from "mongoose";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

//?------------------DELETE------------------------
// endpoint for deleting image from mongo and supabase
export async function DELETE(request: NextRequest) {
  try {
    await mongooseConnect();
    const url = new URL(request.url);
    const img = url.searchParams.get("img");
    const prodId = url.searchParams.get("prodId");

    // extract params
    if (!img || !prodId)
      return Response.json({
        error: "Image or product not found",
        status: 404,
      });

    //delete image from supabase
    const { error: bucketError } = await supabase.storage
      .from("product-images")
      .remove([img]);
    if (bucketError) {
      return Response.json({ error: bucketError.message, status: 404 });
    }

    // then delete image name string from mongo
    await Product.findByIdAndUpdate(
      prodId,
      {
        $pull: {
          images: `https://uydnhquikccddpyxmjwo.supabase.co/storage/v1/object/public/product-images/${img}`,
        }, //$pull operator removes from an existing array all instances of a value or values that match a specified condition
      },
      { new: true, runValidators: true }
    );

    return Response.json({ status: 200, message: "success" });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 404 });
    }
  }
}
