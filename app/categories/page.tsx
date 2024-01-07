"use client";

import SpinnerCircle from "@/components/SpinnerCircle";
import { cn } from "@/lib/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

type CategoryFormValues = { category: string; parentCat: string };
export type CategoryFromDB = {
  _id: string;
  name: string;
  parentCat?: { _id: string; name: string };
  properties?: { propertyName: string; propertyValuesArr: string[] }[];
};

function CategoriesPage() {
  const [isCreatingOrUpdating, setIsCreatingOrUpdating] = useState(false);
  const [categories, setCategories] = useState<Array<CategoryFromDB>>([]);
  const [editingCategory, setEditingCategory] = useState<CategoryFromDB | null>(
    null
  );
  const [isFetchingAllCategories, setIsFetchingAllCategories] = useState(false);
  const [propertiesArray, setPropertiesArray] = useState<
    Array<{ propertyName: string; propertyValuesAsOneString: string }>
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>();

  const getCategories = useCallback(async () => {
    setIsFetchingAllCategories(true);
    try {
      const res = await fetch("/api/categories", { method: "GET" });
      if (res.ok && res.status === 200) {
        const data: { data: Array<CategoryFromDB> } = await res.json();
        setCategories(data.data);
      } else {
        toast.error(`Cannot get categories at the moment: ${res.statusText}`);
      }
    } catch (err) {
      toast.error(
        `Cannot get categories at the moment: ${getErrorMessage(err)}`
      );
    } finally {
      setIsFetchingAllCategories(false);
    }
  }, [setCategories, setIsFetchingAllCategories]);

  // Fetching all categories
  useEffect(() => {
    (async () => {
      await getCategories();
    })();
  }, [getCategories]);

  // Form handler function:
  const createCategory: SubmitHandler<CategoryFormValues> = async (data) => {
    setIsCreatingOrUpdating(true);
    try {
      // When updating category:
      if (editingCategory !== null) {
        if (
          propertiesArray.some(
            (property) =>
              property.propertyName.trim() === "" ||
              property.propertyValuesAsOneString.trim() === ""
          )
        ) {
          toast.error("Poperty name or value cannot be empty");
          return;
        }

        const resp = await fetch("/api/categories", {
          method: "PATCH",
          body: JSON.stringify({
            ...data,
            _id: editingCategory._id,
            propertiesArray,
          }),
        });
        const respBody = await resp.json();
        if (respBody.error || !resp.ok) {
          toast.error(respBody.error || "Error updating category");
          return;
        }

        reset();
        setEditingCategory(null);
        setPropertiesArray([]);
        toast.success(`"${editingCategory.name}" Updated successfully`);
        getCategories();
      }

      // When adding new category
      else {
        if (
          propertiesArray.some(
            (property) =>
              property.propertyName.trim() === "" ||
              property.propertyValuesAsOneString.trim() === ""
          )
        ) {
          toast.error("Poperty name or value cannot be empty");
          return;
        }

        const resp = await fetch("/api/categories", {
          method: "POST",
          body: JSON.stringify({ data, propertiesArray }),
        });

        const respBody = await resp.json();
        if (respBody.error || !resp.ok) {
          toast.error(respBody.error || "Error creating category");
          return;
        }

        setPropertiesArray([]);
        reset();
        toast.success("Created successfully");
        getCategories();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsCreatingOrUpdating(false);
    }
  };

  // delete category fetcher
  const deleteSomeCategory = async (idToDelete: string) => {
    try {
      const deleteResponse = await fetch(
        "/api/categories?_id=" + `${idToDelete}`,
        {
          method: "DELETE",
        }
      );
      const parsedResponse = await deleteResponse.json();
      if (deleteResponse.ok && !("error" in parsedResponse)) {
        return "success";
      } else {
        return "fail";
      }
    } catch (err) {
      console.error(getErrorMessage(err));
    }
  };
  // onClick handler that deletes the category
  const handleDeleteCategoryWithModal = (id: string, name: string) => {
    Swal.fire({
      title: `Deleting "${name}". Are you sure?`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#e11d48",
      animation: false,
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          const success = await deleteSomeCategory(id);
          if (success === "success") {
            toast.success("Category deleted successfully");
            getCategories();
          } else if (success === "fail")
            toast.error(
              "Something went wrong. Make sure you have admin rights"
            );
        })();
      }
    });
  };

  return (
    <div>
      <h1 className="text-teal-700 font-semibold mb-2 text-xl">Categories</h1>
      <label className="inline-block mb-1">
        {editingCategory
          ? `Editing the "${editingCategory.name}" category:`
          : "Quickly create new category:"}
      </label>
      <form
        onSubmit={handleSubmit(createCategory)}
        className={cn("mb-5 p-1 border border-white/0", {
          "border border-teal-600/50 rounded-md p-1": !!editingCategory,
        })}>
        <div className="flex gap-3 max-w-3xl">
          <input
            {...register("category", { required: "Name the category" })}
            className={cn({ "border-red-400": errors.category }, "mb-0")}
            type="text"
            placeholder="Category name"
            disabled={isCreatingOrUpdating}
          />
          <select {...register("parentCat")} className="mb-0">
            <option value={""}>Without parent</option>
            {categories.length > 0 &&
              // filter stands for excluding recursive relation when category has as parent itself
              categories
                .filter((c) => c._id !== editingCategory?._id)
                .map((c) => (
                  <option value={c._id} key={c._id}>
                    {c.name}
                  </option>
                ))}
          </select>
        </div>
        {errors.category && (
          <span className="ml-1 text-red-600">{errors.category.message}</span>
        )}

        <div>
          <label>Properties:</label>
          <button
            type="button"
            onClick={() =>
              setPropertiesArray((prev) => [
                ...prev,
                { propertyName: "", propertyValuesAsOneString: "" },
              ])
            }
            className="bg-teal-700/70 px-2 text-sm py-1 mx-4 mt-4 mb-2 rounded-md text-gray-50 hover:bg-teal-700/80 transition-colors">
            Add property
          </button>
          {propertiesArray.length > 0 && (
            <button
              type="button"
              className="bg-red-800/60 px-2 text-sm py-1 mx-4 mt-4 mb-2 rounded-md text-gray-50 hover:bg-red-800/70 transition-colors"
              onClick={() =>
                setPropertiesArray((prev) => prev.slice(0, prev.length - 1))
              }>
              Remove
            </button>
          )}
          {propertiesArray.map((_property, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Property name"
                value={propertiesArray[i].propertyName}
                onChange={(e) => {
                  setPropertiesArray((prev) => {
                    const copyArr = [...prev];
                    const currentObject = copyArr[i];
                    const updatedObject = {
                      ...currentObject,
                      propertyName: e.target.value,
                    };
                    copyArr[i] = updatedObject;
                    return [...copyArr];
                  });
                }}
              />
              <input
                placeholder="Values (Comma separated!)"
                value={propertiesArray[i].propertyValuesAsOneString}
                onChange={(e) => {
                  setPropertiesArray((prev) => {
                    const copyArr = [...prev];
                    const currentObject = copyArr[i];
                    const updatedObject = {
                      ...currentObject,
                      propertyValuesAsOneString: e.target.value,
                    };
                    copyArr[i] = updatedObject;
                    return [...copyArr];
                  });
                }}
              />
            </div>
          ))}
        </div>

        <div
          className={cn("flex gap-2 mt-3 ", {
            "justify-around": editingCategory,
          })}>
          <button
            type="submit"
            className="btn-primary drop-shadow"
            disabled={isCreatingOrUpdating}>
            {editingCategory ? "Update" : "Add"}
          </button>
          {editingCategory && (
            <button
              className="btn-primary !bg-teal-700/70 !px-2"
              onClick={(e) => {
                e.preventDefault();
                setValue("category", "");
                setValue("parentCat", "");
                setEditingCategory(null);
                setPropertiesArray([]);
              }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {isFetchingAllCategories ? (
        <div className="flex justify-center items-center h-[50vh]">
          <SpinnerCircle />
        </div>
      ) : !editingCategory ? (
        <>
          <table className="default sm:max-w-5xl table-auto">
            <thead>
              <tr className="text-center text-gray-600">
                <th>Category name</th>
                <th>Parent category</th>
                <th className="w-40">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 &&
                categories?.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category.parentCat?.name}</td>
                    <td>
                      <div className="flex gap-1 justify-evenly">
                        <button
                          disabled={isCreatingOrUpdating}
                          onClick={() => {
                            setEditingCategory(() => {
                              setValue("category", category.name);
                              setValue(
                                "parentCat",
                                category.parentCat?._id || ""
                              );
                              setPropertiesArray(
                                category.properties?.map((property) => ({
                                  propertyName: property.propertyName,
                                  propertyValuesAsOneString:
                                    property.propertyValuesArr.join(", "),
                                })) || []
                              );

                              return category;
                            });
                          }}
                          className="btn-primary flex gap-2 justify-center items-center !px-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 ">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          disabled={isCreatingOrUpdating}
                          className="!px-2 btn-primary flex gap-2 justify-center items-center !bg-red-900/60 hover:opacity-90"
                          onClick={() =>
                            handleDeleteCategoryWithModal(
                              category._id,
                              category.name
                            )
                          }>
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
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default CategoriesPage;
