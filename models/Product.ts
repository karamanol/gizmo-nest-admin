import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product needs a name"],
      trim: true,
    },
    description: String,
    price: { type: Number, required: [true, "Product must have a price"] },
    images: [String],
    discount: { type: Number },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    productProperties: { type: Object, default: {} },
    specs: { type: String },
    soldout: { type: Boolean, default: false },
    promoted: { type: Boolean, default: false },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "rating must be positive number"],
      max: [10, "rating must be 10 or below"],
      set: (val: number) => val.toFixed(1),
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// not storing reviews directly on products, using virtuals instead
// when use findOne product - add populating reviews to product
productSchema.virtual("reviews", {
  ref: "Review", //reference to model with this name
  foreignField: "product", // name of the field in the other model where the reference to the current model is stored( ObjectId of product)
  localField: "_id", // where the same ObjectId is stored in current Product model
});

// TEMPLATE TO ATTACH REVIEWS TO PRODUCT:
// const product = await Product.findOne({ _id: id }).populate({
//   path: "reviews",
//   select: "reviewText userName rating",
//   options: { limit: 3 },
// });

export const Product =
  mongoose.models?.Product || mongoose.model("Product", productSchema);
