"use client";

import { cn } from "@/lib/cn";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SpinnerCircle from "./SpinnerCircle";
import supabase from "@/lib/supabase";
import Image from "next/image";
import { CategoryFromDB } from "@/app/categories/page";
import { getErrorMessage } from "@/utils/getErrorMessage";

type ProductFormValues = {
  name: string;
  price: string;
  description: string;
  images?: string[];
  discount: string;
  category: string;
};
type CategoryType = {
  _id: string;
  name: string;
  properties?: CategoryPropertiesType;
  parentCat?: Omit<CategoryType, "parentCat">;
};

type DefaultValuesObjType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  discount: number;
  category: CategoryType;
  productProperties: { [key: string]: string };
};
type CategoryPropertiesType = {
  _id: string;
  propertyName: string;
  propertyValuesArr: string[];
}[];
type ProductFormProps = {
  defaultValuesObj?: DefaultValuesObjType | null;
  action: "Create" | "Update";
  productId?: string;
};

function ProductForm({
  defaultValuesObj,
  action,
  productId,
}: ProductFormProps) {
  const { 0: isFetching, 1: setIsFetching } = useState(false);
  const { 0: newImgNamesArray, 1: setImgNamesArray } = useState<Array<string>>(
    []
  );
  const { 0: oldImgNamesArray, 1: setOldImgNamesArray } = useState<
    Array<string>
  >([]);
  const { 0: newAndOldImgArray, 1: setNewAndOldImgArray } = useState<
    Array<string>
  >([]);

  const { 0: categories, 1: setCategories } = useState<Array<CategoryFromDB>>(
    []
  );
  const { 0: isFetchingCategories, 1: setIsFetchingCategories } =
    useState(false);
  const { 0: isDeletingImage, 1: setIsDeletingImage } = useState("");
  const {
    0: editingProductPropertiesToFill,
    1: setEditingProductPropertiesToFill,
  } = useState<CategoryPropertiesType>([]);
  const {
    0: editingProductPropertiesToSave,
    1: setEditingProductPropertiesToSave,
  } = useState<{ [key: string]: string }>({});

  // set old images from db if they are
  useEffect(() => {
    if (
      defaultValuesObj &&
      defaultValuesObj.images &&
      defaultValuesObj.images.length > 0
    ) {
      setOldImgNamesArray([...defaultValuesObj.images]);
    }
  }, [defaultValuesObj, setOldImgNamesArray]);

  // keep fresh data about new and old images
  useEffect(() => {
    setNewAndOldImgArray([...oldImgNamesArray, ...newImgNamesArray]);
  }, [newImgNamesArray, oldImgNamesArray, setNewAndOldImgArray]);

  // getting all categories to fill options section "Category"
  useEffect(() => {
    (async () => {
      setIsFetchingCategories(true);
      try {
        const categoriesData = await fetch("/api/categories", {
          method: "GET",
        });
        if (!categoriesData.ok)
          throw new Error("Cannot get categories from API");
        const categories = await categoriesData.json();
        setCategories(categories.data);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setIsFetchingCategories(false);
      }
    })();
  }, [setCategories, setIsFetchingCategories]);

  // React-hook-form stuff
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormValues>();

  const router = useRouter();

  // onSubmit form function
  const createOrUpdateProduct: SubmitHandler<ProductFormValues> =
    async function (data) {
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
            body: JSON.stringify({
              ...data,
              productId,
              allProductImages: newAndOldImgArray,
              productProperties: editingProductPropertiesToSave,
            }),
            headers: { "Content-Type": "application/json" },
          });
        }
        const respData = await resp?.json();

        if (resp?.ok && !("error" in respData)) {
          toast.success(`Product ${action}d successfully`);
          router.push("/products");
        } else if (respData.error) {
          toast.error(respData.error);
        }
      } catch (err) {
        if (err instanceof Error) toast.error(err.message);
      } finally {
        setIsFetching(false);
      }
    };

  // Separated function for image uploading to supabase
  async function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    const image = e.target.files?.item(0);
    if (!image) return;
    const imageName = `${crypto.randomUUID()}-${image.name}`.replace(/\//g, ""); //supabase will create folders if any slashes, remove slashes

    const { error: supaError, data } = await supabase.storage
      .from("product-images")
      .upload(imageName, image);
    if (data?.path) {
      const imageUrl = `https://uydnhquikccddpyxmjwo.supabase.co/storage/v1/object/public/product-images/${data.path}`;
      setImgNamesArray((arr) => [...arr, imageUrl]);
      toast.success("Added");
    }
    if (supaError) {
      toast.error(supaError.message);
      throw new Error(supaError.message);
    }
  }

  //function to delete image from supabase
  const deleteImageFromSupa = async (imgToDelete: string, prodId: string) => {
    const preparedString = imgToDelete.split("/").at(-1); // drop all except image name
    if (preparedString) {
      setIsDeletingImage(imgToDelete);
      const resp = await fetch(
        `/api/products/delete-image?img=${preparedString}&prodId=${prodId}`,
        {
          method: "DELETE",
        }
      );
      const data = await resp.json();
      setIsDeletingImage("");
      if ("message" in data) {
        return data.message;
      } else if ("error" in data) {
        return data.error;
      }
    }
  };

  // onChange handler for product properties
  function handlePropertyChange(
    e: ChangeEvent<HTMLSelectElement>,
    propertyName: string
  ) {
    const value = e.target.value;
    setEditingProductPropertiesToSave((prev) => {
      return { ...prev, [propertyName]: value };
    });
  }

  // prefill selected category
  useEffect(() => {
    if (defaultValuesObj instanceof Object && "category" in defaultValuesObj) {
      setValue("category", defaultValuesObj.category._id);
    }
  }, [defaultValuesObj, setValue]);

  // setting all properties that may be filled for this type of product based on category
  useEffect(() => {
    const categoryPropeties = defaultValuesObj?.category?.properties;
    const parentCatPropeties =
      defaultValuesObj?.category?.parentCat?.properties;
    const allProperties = [
      ...(categoryPropeties || []),
      ...(parentCatPropeties || []),
    ]; // properties from product category + properties of PARENT category of category

    // adding old properties of product to show on page as already selected
    const oldProductProperties = defaultValuesObj?.productProperties;
    if (oldProductProperties !== undefined) {
      setEditingProductPropertiesToSave(oldProductProperties);
    }

    setEditingProductPropertiesToFill([...allProperties]);
  }, [
    defaultValuesObj,
    setEditingProductPropertiesToFill,
    setEditingProductPropertiesToSave,
  ]);

  return action === "Update" && !defaultValuesObj ? (
    <SpinnerCircle />
  ) : (
    <form onSubmit={handleSubmit(createOrUpdateProduct)}>
      <label htmlFor="name" className="text-lg">
        Product name:
      </label>
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

      <label htmlFor="category" className="text-lg">
        Category:
      </label>
      <select
        id="category"
        className="h-9"
        disabled={isFetchingCategories}
        {...register("category")}>
        <option value="">Without category</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option value={c._id} key={c._id}>
              {c.name}
            </option>
          ))}
      </select>

      {action === "Update" && editingProductPropertiesToFill.length > 0 && (
        <div className="flex flex-wrap gap-6 items-center mb-3">
          <label className="text-lg">Properties:</label>
          {editingProductPropertiesToFill.map((propObj) => {
            return (
              <div key={propObj._id} className="flex gap-2 items-center ">
                <label className="font-semibold text-gray-800">{`${propObj.propertyName}:`}</label>
                <select
                  defaultValue={
                    defaultValuesObj?.productProperties?.[
                      propObj?.["propertyName"]
                    ] || ""
                  }
                  className="!m-0"
                  onChange={(e) =>
                    handlePropertyChange(e, propObj.propertyName)
                  }>
                  <option value={""}>Not set</option>
                  {propObj.propertyValuesArr.map((val) => {
                    return (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          })}
        </div>
      )}

      <label htmlFor="price" className="text-lg">
        Product price in USD:
      </label>
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

      <label htmlFor="discount" className="text-lg">
        Discount:
      </label>
      {errors?.discount?.message && (
        <span className="ml-4 text-red-700">{errors.discount.message}</span>
      )}
      <input
        id="discount"
        type="number"
        className={cn({ "border-red-400": errors.discount })}
        {...register("discount")}
        placeholder="Product discount"
        defaultValue={defaultValuesObj?.discount || "0"}
        disabled={isFetching}
      />

      {action === "Update" && (
        <>
          <label className="text-lg">Images:</label>
          <div className="flex gap-3">
            <label className="h-24 min-w-[6rem] border flex justify-center items-center text-sm gap-1 bg-gray-50 hover:bg-white rounded-lg  hover:shadow-sm transition-shadow group cursor-pointer mb-3 mr-5">
              <UploadIcon />
              <span className="group-hover:-translate-y-[2px] transition-all">
                Upload
              </span>
              <input
                type="file"
                accept="image/*"
                id="images"
                onChange={uploadImage}
                className="hidden"
              />
            </label>
            <div className="flex w-full overflow-x-auto gap-2">
              {newAndOldImgArray?.map((el, i) => (
                <div key={el} className="h-24 min-w-[6rem] relative rounded-lg">
                  <button
                    className={cn(
                      "rounded-lg absolute z-50 opacity-0 hover:opacity-40 hover:bg-slate-400 transition-all cursor-pointer",
                      { "opacity-40": isDeletingImage === el }
                    )}
                    type="button"
                    onClick={async () => {
                      const result = await deleteImageFromSupa(
                        el,
                        productId || ""
                      );
                      if (result === "success") {
                        setNewAndOldImgArray((prev) =>
                          [...prev].filter((img) => img !== el)
                        );
                      } else {
                        toast.error(result);
                      }
                    }}>
                    <DeleteImageIcon processing={isDeletingImage === el} />
                  </button>
                  <Image
                    fill
                    src={el}
                    alt={`uploaded image ${i}`}
                    className="object-cover rounded-lg border border-gray-20 "
                    quality={50}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <label htmlFor="description" className="text-lg">
        Product description:
      </label>
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

//-------------------------------ICONS -------------------------------
function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className={cn(
        "w-6 h-6 group-hover:-translate-y-[2px] transition-transform"
      )}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}

const DeleteImageIcon = ({ processing }: { processing: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="red"
      className={cn("w-full h-full", { "animate-spin": processing })}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};
