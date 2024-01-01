import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { MongooseError } from "mongoose";
import { NextRequest } from "next/server";
import { authOptions, isAdmin } from "../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

//?--------------POST-----------------
export async function POST(request: NextRequest) {
  try {
    await isAdmin(authOptions);
    await mongooseConnect();
    const { name, price, description, discount, category, specs } =
      await request.json();

    const newProduct = await Product.create({
      name,
      description,
      price,
      discount,
      specs,
      ...(category ? { category } : { $unset: { category: "" } }), // when no category is specified - no category to be set on product
    });
    console.log(newProduct);
    return Response.json({ status: 200, data: newProduct });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 500 });
    }
  }
}

//?--------------GET--------------------
export async function GET(request: NextRequest) {
  await mongooseConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const product = await Product.findById(id).populate({
        path: "category",
        populate: { path: "parentCat" },
      });
      return Response.json({ status: 200, data: product });
    }
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    // console.log(page);
    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(limit + 1);
    return Response.json({ status: 200, data: products });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 500 });
    }
  }
}

//?------------------PATCH------------------------
export async function PATCH(request: NextRequest) {
  try {
    await isAdmin(authOptions);
    await mongooseConnect();
    const {
      name,
      price,
      description,
      productId,
      allProductImages,
      discount,
      category,
      productProperties,
      specs,
      soldout,
      promoted,
    } = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        images: allProductImages,
        discount,
        productProperties,
        ...(category ? { category } : { $unset: { category: "" } }), // when no category is specified - no category to be set on product
        specs,
        soldout,
        promoted,
      },
      { new: true, runValidators: true }
    );
    return Response.json({ status: 200, data: updatedProduct });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 500 });
    }
  }
}

//?------------------------DELETE------------------------
export async function DELETE(request: NextRequest) {
  try {
    await isAdmin(authOptions);
    await mongooseConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ status: 404, error: "Id not found" });

    await Product.findByIdAndDelete(id);
    return Response.json({ status: 204 });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 500 });
    }
  }
}
