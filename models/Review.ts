import mongoose from "mongoose";
import { Product } from "./Product";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "Review needs to be related to some product"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
      maxLength: 50,
    },
    reviewText: {
      type: String,
      required: [true, "Review text is required"],
      maxLength: 1000,
    },
    rating: {
      type: Number,
      default: 10,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.index({ product: 1 });

// function that can update product rating statistic every time we save new review on them
// as static method because later we can call it on review model
reviewSchema.statics.calculateAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId }, // select all reviews of that product
    },
    {
      $group: {
        _id: "$product", // required at least one common field to group it by
        nRating: { $sum: 1 }, // add +1 each review that matches requirements above, so we get number of reviews of product
        avgRating: { $avg: "$rating" }, //actually calculating average rating of all reviews of that product
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

// Caculate avg rating each time new review is saving or creating
// with pre hook it will not work properly because in pre we don't have yet updated data in database,
// so we didn't have yet new data to work with
reviewSchema.post("save", async function () {
  // this points to current saving review doc
  // this.constructor points to the model
  // @ts-ignore
  await this.constructor.calculateAverageRatings(this.product);
});

// calc also when
// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.post(/^findOneAnd/, async (doc) => {
  await doc.constructor.calculateAverageRatings(doc.product);
});

export const Review =
  mongoose.models?.Review || mongoose.model("Review", reviewSchema);
