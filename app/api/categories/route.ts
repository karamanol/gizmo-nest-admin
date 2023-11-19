import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { MongooseError } from "mongoose";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

//?--------------POST-----------------
export async function POST(request: NextRequest) {
  try {
    await mongooseConnect();
    const { category, parentCat } = await request.json();
    const categoryDoc = await Category.create({
      name: category,
      ...(parentCat ? { parentCat } : { $unset: { parentCat: "" } }), // omit if no parent category
    });
    return Response.json({ status: 200, data: categoryDoc });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 500 });
    }
  }
}

//?--------------GET----------------
export async function GET(request: NextRequest) {
  try {
    await mongooseConnect();
    const categories = await Category.find().populate("parentCat");
    return Response.json({ status: 200, data: categories });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 500 });
    }
  }
}

//?--------------PATCH----------------
export async function PATCH(request: NextRequest) {
  await mongooseConnect();
  try {
    const { category, parentCat, _id } = await request.json();

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      {
        name: category,
        ...(parentCat ? { parentCat } : { $unset: { parentCat: "" } }),
      },
      { new: true, runValidators: true }
    );
    return Response.json({ status: 200, data: updatedCategory });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 500 });
    }
  }
}

//?---------------------DELETE--------------------
export async function DELETE(request: NextRequest) {
  await mongooseConnect();
  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");
    if (!_id) return Response.json({ status: 404, error: "Id not found" });

    await Category.findByIdAndDelete(_id);
    return Response.json({ status: 204 });
  } catch (err) {
    if (err instanceof Error || err instanceof MongooseError) {
      return Response.json({ error: err.message, status: 500 });
    }
  }
}