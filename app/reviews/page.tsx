import { deleteReview } from "@/actions/deleteReview";
import UserReview from "@/components/Review";
import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";
import { Types } from "mongoose";
import { MdDeleteForever } from "react-icons/md";

export type Review = {
  _id: Types.ObjectId;
  product: {
    _id: Types.ObjectId;
    name: string;
    id: string;
  };
  userName: string;
  reviewText: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  id: string;
};

async function ReviewsPage() {
  await mongooseConnect();
  const reviews: Review[] = await Review.find()
    .limit(30)
    .sort({ createdAt: "desc" })
    .populate({ path: "product", select: "name" });

  if (Array.isArray(reviews) && reviews.length === 0) {
    return (
      <div className="flex h-full justify-center items-center">
        <p className="text-xl">No reviews</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-2xl font-semibold text-gray-900 my-3">
        Latest reviews:
      </p>
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-2">
            <div className="w-full">
              <UserReview review={review} />
            </div>
            <form
              action={deleteReview}
              className="flex justify-center items-center bg-red-400 rounded-md hover:bg-red-500 transition-colors">
              <input
                name="reviewId"
                readOnly
                hidden
                value={review._id.toString()}
              />
              <button type="submit" className="w-full h-full my-2 px-2">
                <MdDeleteForever className="h-7 w-7 text-gray-100" />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsPage;
