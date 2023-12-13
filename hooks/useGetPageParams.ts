import { useSearchParams } from "next/navigation";

export function useGetPageParams() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") || "1";
  const pageParamIsValid = !isNaN(parseInt(pageParam)); // making sure it is an integer

  const page = Math.max(parseInt(pageParamIsValid ? pageParam : "1"), 1); // making sure it is a positive number
  return page;
}
