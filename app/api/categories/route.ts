import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { MongooseError } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions, isAdmin } from "../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

const prepare = (
  propertiesArr: { propertyName: string; propertyValuesAsOneString: string }[]
) => {
  return propertiesArr.map((property) => {
    return {
      propertyName: property.propertyName.trim(),
      propertyValuesArr: property.propertyValuesAsOneString
        .split(",")
        .map((prop) => prop.trim())
        .filter((string) => string),
    };
  });
};

//?--------------POST-----------------
export async function POST(request: NextRequest) {
  try {
    await isAdmin(authOptions);
    await mongooseConnect();
    const data = await request.json();
    const {
      propertiesArray,
      data: { category, parentCat },
    } = data;

    const preparedPropertiesArray = prepare(propertiesArray);

    const categoryDoc = await Category.create({
      name: category,
      ...(parentCat ? { parentCat } : { $unset: { parentCat: "" } }), // omit if no parent category
      properties: preparedPropertiesArray,
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
  await isAdmin(authOptions);
  await mongooseConnect();
  try {
    const { category, parentCat, _id, propertiesArray } = await request.json();

    const preparedPropertiesArray = prepare(propertiesArray);
    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      {
        name: category,
        ...(parentCat ? { parentCat } : { $unset: { parentCat: "" } }),
        properties: preparedPropertiesArray,
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
  await isAdmin(authOptions);
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
