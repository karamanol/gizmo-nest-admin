"use client";

import { useSession } from "next-auth/react";
import { CiCalculator1 } from "react-icons/ci";
import { IoTodayOutline } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { CiStar } from "react-icons/ci";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PieChartStats from "@/components/PieChartStats";
import { MdOutlineRateReview } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Product = {
  createdAt: string;
  name: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  updatedAt: string;
  _id: string;
};

type OrderStats = {
  totalOrders: number;
  ordersToday: number;
  paidOrders: number;
  deliveredOrders: number;
  topFiveProducts: {
    _id: string;
    totalQuantity: number;
  }[];
  productsInStockQuantity: number;
  reviewsQuantity: number;
  productsByAvgRating: Product[];
};

export default function Home() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<OrderStats>();

  const [parent] = useAutoAnimate();

  useEffect(() => {
    async function getStatistics() {
      try {
        const response = await fetch("/api/orders/get-statistics");
        const stats = await response.json();
        setStats(stats);
      } catch (err) {
        toast.error("Error fetching statistics");
      }
    }
    getStatistics();
  }, []);

  if (!session) return null;

  return (
    <>
      <div className="mb-6 ">
        <h2>
          Hello, <span className="font-semibold">{session?.user?.name}</span>
        </h2>
      </div>
      <div className="grid grid-rows-2 lg:grid-cols-[1fr,1.5fr] lg:grid-rows-1 lg:h-[32rem] gap-4">
        <div className=" overflow-y-auto py-6 px-8 max-w-2xl  bg-gray-100 rounded-xl shadow-md ">
          <div className="flex flex-col gap-3 w-full">
            <div className="text-xl font-medium text-black text-center">
              Dashboard:
            </div>
            <p className=" text-lg text-gray-700 flex items-center gap-2">
              <CiCalculator1 className="scale-125" />{" "}
              <span>Total Orders: {stats?.totalOrders ?? "⌛"}</span>
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <IoTodayOutline />
              <span>Orders Today: {stats?.ordersToday ?? "⌛"}</span>
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <MdAttachMoney className="scale-110" />
              <span>Paid Orders: {stats?.paidOrders ?? "⌛"}</span>
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <TbTruckDelivery />
              <span>Delivered Orders: {stats?.deliveredOrders ?? "⌛"}</span>
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <MdOutlineRateReview />
              <span>Reviews quantity: {stats?.reviewsQuantity ?? "⌛"}</span>
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <CiStar className="scale-125" />
              <span>
                Top 5 rated products:{" "}
                {!stats?.productsByAvgRating ? "⌛" : null}
              </span>
            </p>
            <ol
              ref={parent}
              className="text-gray-700 flex flex-col gap-1 ml-6 list-decimal">
              {stats?.productsByAvgRating.map((product) => (
                <li
                  key={product._id}
                  className=" border w-fit px-3 py-1 rounded-md bg-gray-50">
                  {product.name}: {product.ratingsAverage}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <PieChartStats
          topProducts={stats?.topFiveProducts}
          productsInStockQuantity={stats?.productsInStockQuantity}
        />
      </div>
    </>
  );
}
