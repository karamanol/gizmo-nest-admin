import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: [true, "Category must have a name"] },
  parentCat: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: { type: mongoose.Types.Map },
});

export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
