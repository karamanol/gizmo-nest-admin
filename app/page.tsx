"use client";

import { useSession } from "next-auth/react";
import { CiCalculator1 } from "react-icons/ci";
import { IoTodayOutline } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { CiStar } from "react-icons/ci";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type OrderStats = {
  totalOrders: number;
  ordersToday: number;
  paidOrders: number;
  deliveredOrders: number;
  topThreeProducts: {
    _id: string;
    totalQuantity: number;
  }[];
};

export default function Home() {
  const { data: session } = useSession();
  const [data, setData] = useState<OrderStats>();

  const [parent] = useAutoAnimate();

  useEffect(() => {
    async function getStatistics() {
      try {
        const response = await fetch("/api/orders/get-statistics");
        const data = await response.json();
        setData(data);
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
      <div className="p-6 max-w-lg  bg-gray-100 rounded-xl shadow-md flex items-center px-6">
        <div className="flex flex-col gap-2 w-full">
          <div className="text-xl font-medium text-black text-center">
            Dashboard:
          </div>
          <p className="text-gray-700 flex items-center gap-2">
            <CiCalculator1 className="scale-125" />{" "}
            <span>Total Orders: {data?.totalOrders ?? "⌛"}</span>
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <IoTodayOutline />
            <span>Orders Today: {data?.ordersToday ?? "⌛"}</span>
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <MdAttachMoney />
            <span>Paid Orders: {data?.paidOrders ?? "⌛"}</span>
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <TbTruckDelivery />
            <span>Delivered Orders: {data?.deliveredOrders ?? "⌛"}</span>
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <CiStar className="scale-125" />
            <span>
              Top 3 popular ordered products:{" "}
              {!data?.topThreeProducts.length ? "⌛" : null}
            </span>
          </p>
          <ol
            ref={parent}
            className="text-gray-700 flex flex-col gap-1 ml-6 mt-1 list-decimal">
            {data?.topThreeProducts.map((product) => (
              <li
                key={product._id}
                className=" border w-fit px-3 py-1 rounded-md bg-gray-50">
                {product._id}: {product.totalQuantity} items
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
