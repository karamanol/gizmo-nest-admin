import { Schema, Types, model, models } from "mongoose";

const orderedProducts = new Schema({
  category: { type: String },
  quantity: { type: Number, required: [true, "Product must have a quantity"] },
  name: { type: String, required: [true, "Product must have a name"] },
});

const orderSchema = new Schema(
  {
    orderedProducts: [orderedProducts],
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    city: { type: String, required: [true, "City is required"] },
    postcode: { type: String, required: [true, "Postal code is required"] },
    address: { type: String, required: [true, "Address is required"] },
    country: { type: String, required: [true, "Country is required"] },
    number: { type: String, required: [true, "Phone number is required"] },
    paid: { type: Boolean, required: [true, "Paid status is required"] },
    delivered: {
      type: Boolean,
      required: [true, "Delivery status is required"],
    },
  },
  { timestamps: true }
);

export const Order = models?.Order || model("Order", orderSchema);

// TS
export type OrderedProductType = {
  _id: Types.ObjectId;
  category?: string;
  quantity: number;
  name: string;
};

export type OrderType = {
  _id: Types.ObjectId;
  orderedProducts: OrderedProductType[];
  name: string;
  email: string;
  city: string;
  postcode: string;
  address: string;
  country: string;
  number: string;
  paid: boolean;
  delivered: boolean;
  createdAt: string;
  updatedAt: string;
};
