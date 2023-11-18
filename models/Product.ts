import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Product needs a name"] },
  description: String,
  price: { type: Number, required: [true, "Product must have a price"] },
  images: [String],
  discount: String,
});
export const Product =
  // @ts-ignore
  mongoose.models.Product || mongoose.model("Product", productSchema);
