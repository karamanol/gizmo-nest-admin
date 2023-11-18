import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: [true, "Category must have a name"] },
  parentCat: { type: mongoose.Types.ObjectId, ref: "Category" },
});

export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
