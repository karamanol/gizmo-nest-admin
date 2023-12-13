import { useSearchParams } from "next/navigation";

const sortByStrings = [
  "new_first",
  "old_first",
  "paid_first",
  "not_paid_first",
  "delivered_first",
  "not_delivered_first",
];

export function useGetSortParams() {
  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort") || "new_first";
  const sortParamIsValid = sortByStrings.includes(sortParam);

  const sorting = sortParamIsValid ? sortParam : "new_first";

  return sorting;
}
