"use client";

import Pagination from "@/components/Pagination";
import SpinnerCircle from "@/components/SpinnerCircle";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast/headless";

type Product = {
  name: string;
  description: string;
  price: number;
  _id: string;
};

export default function Products() {
  const { 0: products, 1: setPoducts } = useState<Array<Product>>();

  //================================================================

  const searchParams = useSearchParams();
  const searchParamsPageString = searchParams.get("page") || "";
  const searchParamsPageStringIsValid = !isNaN(
    parseInt(searchParamsPageString)
  ); // making sure it is an integer

  const { 0: page, 1: setPage } = useState(
    searchParamsPageStringIsValid
      ? Math.max(+searchParamsPageString, 1) // preventing case when page is set to negative number
      : 1
  );

  useEffect(() => {
    (() => {
      if (typeof window === "undefined") return;
      window.history.pushState(null, "", `?page=${page}`);
    })();
  }, [page]);

  //================================================================

  useEffect(
    function () {
      async function getProducts() {
        try {
          const res = await fetch(`/api/products?page=${page}`, {
            method: "GET",
          });
          if (res.ok) {
            const data = await res.json();
            setPoducts(data.data);
          }
        } catch (err) {
          if (err instanceof Error) toast.error(err.message);
        }
      }
      getProducts();
    },
    [setPoducts, page]
  );

  console.log("products", products);
  return (
    <div>
      <Link
        href={"/products/new_product"}
        className="btn-primary hover:bg-teal-600 transition-colors">
        Add new product
      </Link>

      <div className="sm:max-w-5xl">
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
        {!products && (
          <div className="flex justify-center items-center h-[75vh] sm:max-w-5xl">
            <SpinnerCircle />
          </div>
        )}
        {(products?.length || 0) < 21 &&
        page === 1 ? null : !products ? null : (
          <Pagination
            page={page}
            setPage={setPage}
            isDisabledNextBtn={(products?.length || 0) < 11}
          />
        )}
      </div>
    </div>
  );
}
