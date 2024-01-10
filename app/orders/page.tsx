"use client";

import SpinnerCircle from "@/components/SpinnerCircle";
import { cn } from "@/lib/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import Pagination from "@/components/Pagination";
import { useGetPageParams } from "@/hooks/useGetPageParams";
import { useGetSortParams } from "@/hooks/useGetSortParams";

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

const ORDERS_PER_PAGE = 10;

function OrdersPage() {
  const [orders, setOrders] = useState<Array<OrderType>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const sortingBy = useGetSortParams();
  const pageNum = useGetPageParams();

  // fetching orders data for table
  const getOrders = useCallback(
    async (sortBy: string) => {
      try {
        setIsLoading(true);
        if (!sortBy) return;
        const url = `/api/orders?${new URLSearchParams({
          page: pageNum.toString(),
          sort: sortBy,
        })}`;
        const resp = await fetch(url, { method: "GET" });
        const ordersData = await resp.json();
        if (Array.isArray(ordersData)) setOrders(ordersData);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setOrders, pageNum]
  );

  useEffect(() => {
    (async () => {
      try {
        await getOrders(sortingBy);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    })();
  }, [getOrders, sortingBy]);

  // delete order fetcher
  const deleteSomeOrder = async (idToDelete: string) => {
    try {
      const deleteResponse = await fetch("/api/orders?_id=" + `${idToDelete}`, {
        method: "DELETE",
      });
      const parsedResponse = await deleteResponse.json();

      if (deleteResponse.ok && !parsedResponse?.error) {
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
              getOrders(sortingBy);
            } else {
              toast.error(
                "Something went wrong. Make sure you are signed in as administrator."
              );
            }
          })();
        }
      }),
    [getOrders, sortingBy]
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
            getOrders(sortingBy);
          } else if ("success" in body && body.success === "fail") {
            toast.error(
              "Something went wrong. Make sure you are signed in as administrator"
            );
          }
        })();
      }
    });
  };

  return (
    <div className="max-w-7xl">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <SpinnerCircle />
        </div>
      ) : (
        <div>
          <div className="flex m-2 gap-2 h-12 items-center ">
            <span className="sm:text-xl whitespace-nowrap">Sort by:</span>
            <select
              className="!w-fit m-0"
              value={sortingBy}
              onChange={(e) => {
                router.push(
                  `?${new URLSearchParams({
                    page: pageNum.toString(),
                    sort: e.target.value,
                  })}`
                );
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
              <span className="text-sm sm:text-base">
                Delete all unpaid orders
              </span>
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
          {Array.isArray(orders) && orders.length === 0 && !isLoading ? (
            <div className="flex justify-center my-10">
              <span className="text-2xl text-gray-800">
                No orders to show on this page...
              </span>
            </div>
          ) : null}

          {orders.length <= ORDERS_PER_PAGE && pageNum === 1 ? null : (
            <Pagination
              sortBy={sortingBy}
              page={pageNum}
              isDisabledNextBtn={orders.length <= ORDERS_PER_PAGE}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
