"use client";

import SpinnerCircle from "@/components/SpinnerCircle";
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
  const { 0: products, 1: setPoducts } = useState<Array<Product>>();

  useEffect(
    function () {
      async function getProducts() {
        try {
          const res = await fetch("/api/products", { method: "GET" });
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
    [setPoducts]
  );

  return (
    <div>
      <Link
        href={"/products/new_product"}
        className="btn-primary hover:bg-teal-600 transition-colors">
        Add new product
      </Link>

      <table className="default mt-4 sm:max-w-5xl">
        <thead>
          <tr>
            <td>Product name</td>
            <td className="w-52">Action</td>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product._id}>
              <td>{product?.name}</td>
              <td className="flex gap-1 justify-evenly">
                <Link href={"/products/edit/" + product._id}>
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
                <Link href={"/products/delete/" + product._id}>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!products && <SpinnerCircle />}
    </div>
  );
}
