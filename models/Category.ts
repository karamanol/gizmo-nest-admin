import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema({
  propertyName: {
    type: String,
    required: [true, "Property must have a name"],
  },
  propertyValuesArr: {
    type: [String],
    required: [true, "Add at least one value for the property"],
  },
});

const categorySchema = new Schema({
  name: { type: String, required: [true, "Category must have a name"] },
  parentCat: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: { type: [propertySchema] },
});

export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export type CategoryPropertyType = {
  propertyName: string;
  propertyValuesArr: string[];
};

export type CategoryType = {
  name: string;
  parentCat: string;
  properties: CategoryPropertyType[];
};

export const example = {
  name: "TV's",
  parentCat: "655a3ffb65565c857b08b397",
  properties: [
    { propertyName: "diagonal", propertyValuesArr: ["55", "65", "78"] },
  ],
};
