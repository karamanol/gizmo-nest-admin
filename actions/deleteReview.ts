"use server";

import { authOptions, isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";
import { revalidatePath } from "next/cache";

export const deleteReview = async (formData: FormData) => {
  const reviewId = formData.get("reviewId");
  if (!reviewId) throw new Error("Something went wrong");
  await mongooseConnect();
  await isAdmin(authOptions);
  await Review.findByIdAndDelete(reviewId);
  revalidatePath("/reviews");
};
