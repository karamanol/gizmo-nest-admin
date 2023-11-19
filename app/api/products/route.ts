import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { MongooseError } from "mongoose";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

//?--------------POST-----------------
export async function POST(request: NextRequest) {
  await mongooseConnect();
  try {
    const { name, price, description, discount, category } =
      await request.json();
    const newProduct = await Product.create({
      name,
      description,
      price,
      discount,
      ...(category ? { category } : { $unset: { category: "" } }), // when no category is specified - no category to be set on product
    });
    return Response.json({ status: 200, data: newProduct });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 500 });
    }
  }
}

//?--------------GET--------------------
export async function GET(request: Request) {
  await mongooseConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const product = await Product.findById(id);
      return Response.json({ status: 200, data: product });
    }

    const products = await Product.find();
    return Response.json({ status: 200, data: products });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 500 });
    }
  }
}

//?------------------PATCH------------------------
export async function PATCH(request: NextRequest) {
  await mongooseConnect();
  try {
    const {
      name,
      price,
      description,
      productId,
      allProductImages,
      discount,
      category,
    } = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        price,
        images: allProductImages,
        discount,
        ...(category ? { category } : { $unset: { category: "" } }), // when no category is specified - no category to be set on product
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
  await mongooseConnect();
  try {
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