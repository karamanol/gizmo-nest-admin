"use client";

import ProductForm from "@/components/ProductForm";
import { useEffect, useState } from "react";

function EditProductPage({ params }: { params: { productId: string } }) {
  const id = params.productId;
  const [productValues, setProductValues] = useState();
  useEffect(() => {
    if (id === undefined || id.length === 0) return;

    fetch("/api/products?id=" + id[0], { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setProductValues(data.data);
      })
      .catch((err) => {
        console.error(err.message);
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
