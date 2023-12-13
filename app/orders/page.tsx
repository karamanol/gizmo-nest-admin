"use client";

import SpinnerCircle from "@/components/SpinnerCircle";
import { cn } from "@/lib/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import Pagination from "@/components/Pagination";
import { useGetPageParams } from "@/hooks/useGetPageParams";

type OrderedProductType = {
  _id: string;
  category?: string;
  discount: number;
  price: number;
  quantity: number;
  name: string;
};

type OrderType = {
  _id: string;
  orderedProducts: OrderedProductType[];
  name: string;
  email: string;
  city: string;
  postcode: string;
  address: string;
  country: string;
  number: string;
  paid: boolean;
  delivered: boolean;
  updatedAt: string;
  createdAt: string;
};

const sortByStrings = [
  "new_first",
  "old_first",
  "paid_first",
  "not_paid_first",
  "delivered_first",
  "not_delivered_first",
];

const ORDERS_PER_PAGE = 10;

function OrdersPage() {
  const { 0: orders, 1: setOrders } = useState<Array<OrderType>>([]);
  const { 0: isLoading, 1: setIsLoading } = useState(false);

  const searchParams = useSearchParams();
  const searchParamsSortString = searchParams.get("sort") || "";
  const searchParamsSortStringIsValid = sortByStrings.includes(
    searchParamsSortString
  );

  const { 0: sortBy, 1: setSortBy } = useState<string>(
    searchParamsSortStringIsValid ? searchParamsSortString : "new_first"
  );

  const page = useGetPageParams();

  // synchronization between sortBy and params
  useEffect(() => {
    (() => {
      if (typeof window === "undefined") return;
      if (sortByStrings.includes(sortBy)) {
        window.history.pushState(null, "", `?page=${page}&sort=${sortBy}`);
      }
    })();
  }, [sortBy, page]);

  // fetching orders data for table
  const getOrders = useCallback(
    async (sortBy: string) => {
      try {
        setIsLoading(true);
        if (!sortBy) return;
        const url = `/api/orders?page=${page}&sort=${sortBy}`;
        const resp = await fetch(url, { method: "GET" });
        const ordersData = await resp.json();
        if (Array.isArray(ordersData)) setOrders(ordersData);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setOrders, page]
  );

  useEffect(() => {
    (async () => {
      try {
        await getOrders(sortBy);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    })();
  }, [getOrders, sortBy]);

  // delete order fetcher
  const deleteSomeOrder = async (idToDelete: string) => {
    try {
      const deleteResponse = await fetch("/api/orders?_id=" + `${idToDelete}`, {
        method: "DELETE",
      });
      const parsedResponse = await deleteResponse.json();
      if (deleteResponse.ok && !("error" in parsedResponse)) {
        return "success";
      } else {
        return "fail";
      }
    } catch (err) {
      console.error(getErrorMessage(err));
    }
  };
  // onClick handler that deletes or updates the order
  const handleDeleteOrUpdateWithModal = useCallback(
    (modalMessage: string, cb: () => Promise<"success" | "fail" | undefined>) =>
      Swal.fire({
        title: modalMessage,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Confirm",
        confirmButtonColor: "#e11d48",
        animation: false,
      }).then((result) => {
        if (result.isConfirmed) {
          (async () => {
            const success = await cb();
            if (success === "success") {
              toast.success("Done!");
              getOrders(sortBy);
            } else if (success === "fail") {
              toast.error("Something went wrong");
            }
          })();
        }
      }),
    [getOrders, sortBy]
  );
  // patch the order
  const updateOrder = async (
    OrderIdToUpdate: string,
    propertyToUpdate: "paid" | "delivered",
    valueAsBool: boolean
  ) => {
    try {
      const updateResponse = await fetch(
        "/api/orders?_id=" + `${OrderIdToUpdate}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [propertyToUpdate]: valueAsBool,
            _id: OrderIdToUpdate,
          }),
        }
      );

      const parsedResponse = await updateResponse.json();
      if (updateResponse.ok && !("error" in parsedResponse)) {
        return "success";
      } else {
        return "fail";
      }
    } catch (err) {
      console.error(getErrorMessage(err));
    }
  };
  const handleDeleteAllUnpaid = async () => {
    Swal.fire({
      title: `Deleting all unpaid orders. Are you sure?`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#e11d48",
      animation: false,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          const data = await fetch("/api/orders/delete-all-unpaid", {
            method: "DELETE",
          });
          const body = await data.json();

          if ("success" in body && body.success === "success") {
            toast.success("All unpaid orders deleted successfully");
            getOrders(sortBy);
          } else if ("success" in body && body.success === "fail")
            toast.error("Something went wrong");
        })();
      }
    });
  };

  return (
    <div className="">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <SpinnerCircle />
        </div>
      ) : (
        <>
          <div className="flex m-2 gap-2 h-12 items-center">
            <span className="text-xl">Sort by:</span>
            <select
              className="!w-fit m-0"
              value={sortBy} //?
              onChange={(e) => {
                setSortBy(e.target.value);
              }}>
              <option value={"new_first"}>Newest first</option>
              <option value={"old_first"}>Oldest first</option>
              <option value={"paid_first"}>Paid orders first</option>
              <option value={"not_paid_first"}>Unpaid orders first</option>
              <option value={"delivered_first"}>Delivered orders first</option>
              <option value={"not_delivered_first"}>
                Undelivered orders first
              </option>
            </select>
            <button
              className="btn-primary ml-auto"
              type="button"
              onClick={handleDeleteAllUnpaid}>
              Delete all unpaid orders
            </button>
          </div>
          <table className="default table-auto ">
            <thead>
              <tr className="text-center text-gray-600">
                <th>Time and status</th>
                <th>Recipient info</th>
                <th>Ordered products</th>
                <th className="w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length > 0
                ? orders.slice(0, 10).map((order) => {
                    return (
                      <tr key={order._id} className="even:bg-gray-300">
                        <td className="max-w-[9rem] min-w-[9rem]">
                          <div className="flex flex-col gap-3 p-2 w-fit ">
                            <span className="text-center">
                              {new Date(order.updatedAt)
                                .toUTCString()
                                .replace(" GMT", "")}
                            </span>
                            <br />
                            <span
                              className={cn(
                                order.paid
                                  ? "bg-green-600/30"
                                  : "bg-yellow-500/30",
                                "inline-block border rounded-md border-gray-400 px-2 py-1  text-center"
                              )}>
                              {order.paid ? "Paid" : "Not paid"}
                            </span>
                            {order.delivered && (
                              <span className="flex justify-around items-center gap-1 border rounded-md border-gray-400 px-2 py-1  text-center bg-blue-500/40">
                                {"Delivered"}
                                {
                                  <FaCheckCircle className="w-5 h-5 text-gray-700 bg-green-500/60 rounded-full" />
                                }
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="max-w-xs">
                          <div className="flex gap-1 flex-wrap  overflow-x-auto p-2">
                            <span className="infoCell">{order.email}</span>
                            <span className="infoCell">{order.name}</span>
                            <span className="infoCell">{order.city}</span>
                            <span className="infoCell">{order.postcode}</span>
                            <span className="infoCell">{order.country}</span>
                            <span className="infoCell">{order.address}</span>
                          </div>
                        </td>

                        <td className="">
                          <div className="flex gap-1 flex-col max-w-xs overflow-x-auto p-2 mx-auto ">
                            {order.orderedProducts.map((prod) => (
                              <span className="infoCell" key={`${prod._id}`}>
                                {`${prod.name}: x${prod.quantity}`}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className=" flex flex-col gap-1">
                            <button
                              type="button"
                              className="bg-red-800/60 px-2 text-sm py-2  rounded-md text-gray-50 hover:bg-red-800/70 transition-colors"
                              onClick={() =>
                                handleDeleteOrUpdateWithModal(
                                  `Confirm ${order.email}'s order deletion`,
                                  () => {
                                    return deleteSomeOrder(order._id);
                                  }
                                )
                              }>
                              Delete order
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteOrUpdateWithModal(
                                  `Mark ${order.email}'s order as ${
                                    order?.paid ? "not" : ""
                                  } paid?`,
                                  () =>
                                    updateOrder(order._id, "paid", !order.paid)
                                )
                              }
                              className="bg-teal-700/70 px-2 text-sm py-2 rounded-md text-gray-50 hover:bg-teal-700/80 transition-colors">
                              {`Mark as ${order?.paid ? "not" : ""} paid`}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteOrUpdateWithModal(
                                  `Mark ${order.email}'s order as ${
                                    order?.delivered ? "not" : ""
                                  } delivered?`,
                                  () =>
                                    updateOrder(
                                      order._id,
                                      "delivered",
                                      !order.delivered
                                    )
                                )
                              }
                              className="bg-blue-800/60  px-2 text-sm py-2 rounded-md text-gray-50 hover:bg-blue-800/70  transition-colors">
                              {`Mark as ${
                                order?.delivered ? "not" : ""
                              } delivered`}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
          {Array.isArray(orders) && orders.length === 0 ? (
            <div className="flex justify-center my-10">
              <span className="text-2xl text-gray-800">
                No orders to show on this page
              </span>
            </div>
          ) : null}

          {orders.length <= ORDERS_PER_PAGE && page === 1 ? null : (
            <Pagination
              page={page}
              isDisabledNextBtn={orders.length <= ORDERS_PER_PAGE}
            />
          )}
        </>
      )}
    </div>
  );
}

export default OrdersPage;
