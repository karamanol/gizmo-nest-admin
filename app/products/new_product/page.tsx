import ProductForm from "@/components/ProductForm";

function NewProduct() {
  return (
    <>
      <h1 className="text-teal-700 font-semibold mb-2 text-xl">
        Adding new product:
      </h1>
      <ProductForm action="Create" />
    </>
  );
}

export default NewProduct;
