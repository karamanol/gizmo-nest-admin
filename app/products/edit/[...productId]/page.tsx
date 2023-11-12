"use client";

import ProductForm from "@/components/ProductForm";
import { useEffect, useState } from "react";

function EditProductPage({ params }: { params: { productId: string } }) {
  const id = params.productId;
  const { 0: productValues, 1: setProductValues } = useState(null);
  useEffect(() => {
    if (id === undefined || id.length === 0) return;

    fetch("/api/products?id=" + id[0], { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setProductValues(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, setProductValues]);

  return (
    <>
      <h1 className="text-teal-700 font-semibold mb-2 text-xl">
        Edit product:
      </h1>
      <ProductForm
        defaultValuesObj={productValues}
        action="Update"
        productId={id[0]}
      />
    </>
  );
}

export default EditProductPage;
