"use client";

import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SpinnerCircle from "./SpinnerCircle";

type ProductFormValues = {
  name: string;
  price: string;
  description: string;
  images: FileList;
};

type ProductFormProps = {
  defaultValuesObj?: ProductFormValues | null;
  action: "Create" | "Update";
  productId?: string;
};

function ProductForm({
  defaultValuesObj,
  action,
  productId,
}: ProductFormProps) {
  const { 0: isFetching, 1: setIsFetching } = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>();
  const router = useRouter();

  // onSubmit function
  const createProduct: SubmitHandler<ProductFormValues> = async function (
    data
  ) {
    setIsFetching(true);
    let resp;
    try {
      if (action === "Create") {
        resp = await fetch("/api/products", {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
      } else if (action === "Update") {
        resp = await fetch("/api/products", {
          method: "PATCH",
          body: JSON.stringify({ ...data, productId }),
          headers: { "Content-Type": "application/json" },
        });
      }

      if (resp?.ok) {
        toast.success(`Product ${action}d successfully`);
        router.push("/products");
      } else if (resp?.statusText) {
        toast.error(resp.statusText);
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  // function uploadImages(e: ChangeEvent<HTMLInputElement>) {
  //   console.log(e);
  // }

  return action === "Update" && !defaultValuesObj ? (
    <SpinnerCircle />
  ) : (
    <form onSubmit={handleSubmit(createProduct)}>
      <label htmlFor="name">Product name:</label>
      {errors?.name?.message && (
        <span className="ml-4 text-red-700">{errors?.name?.message}</span>
      )}
      <input
        defaultValue={defaultValuesObj?.name}
        disabled={isFetching}
        className={cn({ "border-red-400": errors.name })}
        id="name"
        {...register("name", { required: "Unacceptable name" })}
        type="text"
        placeholder="Product name"
      />

      <label htmlFor="price">Product price in USD:</label>
      {errors?.price?.message && (
        <span className="ml-4 text-red-700">{errors?.price?.message}</span>
      )}
      <input
        defaultValue={defaultValuesObj?.price}
        disabled={isFetching}
        className={cn({ "border-red-400": errors.price })}
        id="price"
        {...register("price", { required: "Unacceptable price" })}
        type="number"
        placeholder="Product price"
      />

      <label>Images:</label>
      <div>
        <label className="h-24 w-24 border flex justify-center items-center text-sm gap-1 bg-gray-50 hover:bg-white rounded-lg  hover:shadow-sm transition-shadow group cursor-pointer">
          <UploadIcon />
          <span className="group-hover:-translate-y-[2px] transition-transform">
            Upload
          </span>
          <input
            type="file"
            id="images"
            {...register("images")}
            className="hidden"
          />
        </label>
        {!defaultValuesObj?.images.length ? <div>No images</div> : ""}
      </div>

      <label htmlFor="description">Product description:</label>
      <textarea
        defaultValue={defaultValuesObj?.description}
        disabled={isFetching}
        id="description"
        {...register("description")}
        placeholder="Description"
      />

      <button
        type="submit"
        className="btn-primary flex gap-1"
        disabled={isFetching}>
        {isFetching ? (
          <>
            <span>{action}</span>
            <div className="w-5 h-5 animate-spin border-b-2 rounded-full border-teal-500"></div>
          </>
        ) : (
          action
        )}
      </button>
    </form>
  );
}

export default ProductForm;

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className="w-6 h-6  group-hover:-translate-y-[2px] transition-transform">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}
