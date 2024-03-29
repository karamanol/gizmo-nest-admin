"use client";

import Pagination from "@/components/Pagination";
import SpinnerCircle from "@/components/SpinnerCircle";
import { useGetPageParams } from "@/hooks/useGetPageParams";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast/headless";

type Product = {
  name: string;
  description: string;
  price: number;
  _id: string;
};

export default function Products() {
  const [products, setPoducts] = useState<Array<Product>>();
  const [isLoading, setIsLoading] = useState(false);

  const page = useGetPageParams();

  useEffect(
    function () {
      async function getProducts() {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/products?page=${page}`, {
            method: "GET",
          });
          if (!res.ok) throw new Error("Error fetching products");
          const data = await res.json();
          if ("data" in data) {
            setPoducts(data.data);
          }
        } catch (err) {
          if (err instanceof Error) toast.error(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      getProducts();
    },
    [setPoducts, page, setIsLoading]
  );

  return (
    <div>
      <Link
        href={"/products/new_product"}
        className="btn-primary hover:bg-teal-600 transition-colors">
        Add new product
      </Link>

      <div className="sm:max-w-5xl">
        {isLoading ? (
          <div className="flex justify-center items-center h-[75vh] sm:max-w-5xl">
            <SpinnerCircle />
          </div>
        ) : (
          <table className="default mt-4  table-auto ">
            <thead>
              <tr className="text-gray-600">
                <th className="">Product name</th>
                <th className="w-48">Action</th>
              </tr>
            </thead>
            <tbody>
              {products?.slice(0, 20).map((product) => (
                <tr key={product._id} className="h-10">
                  <td>{product?.name}</td>
                  <td>
                    <div className="flex gap-1 justify-evenly">
                      <Link
                        href={"/products/edit/" + product._id}
                        className="!rounded-md hover:bg-teal-600 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 translate-y-[10%]">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          />
                        </svg>
                        <span className="mr-2 ml-1">Edit</span>
                      </Link>
                      <Link
                        href={"/products/delete/" + product._id}
                        className="!rounded-md !bg-red-900/60 hover:opacity-90 transition-all">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Delete
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {Array.isArray(products) && products.length === 0 ? (
          <div className="flex justify-center my-10">
            <span className="text-2xl text-gray-800">
              No products to show on this page
            </span>
          </div>
        ) : null}

        {(products?.length || 0) < 21 &&
        page === 1 ? null : !products ? null : (
          <Pagination
            page={page}
            // setPage={setPage}
            isDisabledNextBtn={(products?.length || 0) < 21}
          />
        )}
      </div>
    </div>
  );
}
