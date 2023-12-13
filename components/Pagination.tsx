"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiMiniArrowLongLeft, HiMiniArrowLongRight } from "react-icons/hi2";

type PaginationProps = {
  page: number;
  isDisabledNextBtn: boolean;
  sortBy?: string;
};

function Pagination({ page, isDisabledNextBtn, sortBy }: PaginationProps) {
  const router = useRouter();

  const sort = sortBy ? `&sort=${sortBy}` : "";
  const prevPage = `?page=${Math.max(page - 1, 1)}` + sort;
  const nextPage = `?page=${page + 1}` + sort;

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      router.push(`?page=${event.currentTarget.value}` + sort);
    }
  };

  return (
    <div className="flex gap-3 mt-5 justify-end mr-1 h-9">
      <Link
        href={prevPage}
        className={cn(
          page <= 1 ? "!bg-gray-400 pointer-events-none" : "",
          "btn-primary !px-6 "
        )}>
        <HiMiniArrowLongLeft className="h-6 w-6 translate-y-[5%]" />
      </Link>

      <input
        className="w-16 !mb-0"
        placeholder={page.toString()}
        type="number"
        onKeyDown={handleKeyPress}
      />

      <Link
        href={nextPage}
        className={cn(
          isDisabledNextBtn ? "!bg-gray-400 pointer-events-none" : "",
          "btn-primary !px-6"
        )}>
        <HiMiniArrowLongRight className="h-6 w-6 translate-y-[5%]" />
      </Link>
    </div>
  );
}

export default Pagination;
