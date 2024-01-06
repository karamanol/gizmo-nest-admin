"use client";

import SpinnerCircle from "@/components/SpinnerCircle";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function DeleteProduct({ params }: { params: { productId: string } }) {
  const [productName, setProductName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const id = params.productId[0];

  const onDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      // Getting the product to take his image strings
      const getResponse = await fetch("/api/products?id=" + id, {
        method: "GET",
      });
      if (!getResponse.ok) throw new Error("Error getting product info");
      const data = await getResponse.json();
      const imgArr = data.data.images;
      // deleting product images
      if (!!imgArr.length) {
        const imgNamesArray = imgArr.map((str: string) => {
          // removing url prefix from the image name
          return str.split("/").at(-1);
        });
        const { error: bucketError } = await supabase.storage
          .from("product-images")
          .remove(imgNamesArray);
        if (bucketError) toast.error("Photos not found in the bucket");
      }
      // after deleting product images, we can delete the actual product
      const deleteResponse = await fetch("/api/products?id=" + id, {
        method: "DELETE",
      });
      if (deleteResponse.ok) {
        toast.success("Deleted successfully");
        router.push("/products");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
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
          console.error(err.message);
        }
      }
    }
    getProduct(id);
  }, [id, setProductName]);

  return productName ? (
    <div className="lg:mr-[30%] ">
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
          onClick={() => router.push("/products")}
          disabled={isDeleting}>
          Refuse
        </button>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-[50vh] sm:max-w-5xl">
      <SpinnerCircle />
    </div>
  );
}

export default DeleteProduct;
