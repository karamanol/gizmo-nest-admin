"use client";

import SpinnerCircle from "@/components/SpinnerCircle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function DeleteProduct({ params }: { params: { productId: string } }) {
  const { 0: productName, 1: setProductName } = useState("");
  const { 0: isDeleting, 1: setIsDeleting } = useState(false);
  const router = useRouter();
  const id = params.productId[0];

  const onDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/products?id=" + id, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        router.push("/products");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        toast(err.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    async function getProduct(id: string) {
      try {
        const res = await fetch("/api/products/?id=" + id);
        if (res.ok) {
          const data = await res.json();
          setProductName(data.data.name);
        }
      } catch (err) {
        if (err instanceof Error) {
          toast(err.message);
          console.log(err.message);
        }
      }
    }
    getProduct(id);
  }, [id, setProductName]);

  return productName ? (
    <div className="sm:mr-[30%] ">
      <h2 className="text-3xl text-center">
        Confirm deletion of product &quot;{productName}&quot;?
      </h2>
      <div className="flex gap-4 justify-evenly mt-16">
        <button className="btn-delete" onClick={onDelete} disabled={isDeleting}>
          {!isDeleting ? (
            "Confirm"
          ) : (
            <div className="flex gap-2">
              <span>Deleting</span>
              <div className="w-5 h-5 animate-spin border-b-2 rounded-full border-teal-500"></div>
            </div>
          )}
        </button>
        <button
          className="btn-default"
          onClick={() => router.push("/")}
          disabled={isDeleting}>
          Refuse
        </button>
      </div>
    </div>
  ) : (
    <SpinnerCircle />
  );
}

export default DeleteProduct;
