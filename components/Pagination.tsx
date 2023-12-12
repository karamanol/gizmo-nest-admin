"use client";

import { cn } from "@/lib/cn";
import { SetStateAction } from "react";
import { HiMiniArrowLongLeft, HiMiniArrowLongRight } from "react-icons/hi2";

type PaginationProps = {
  page: number;
  setPage: (value: SetStateAction<number>) => void;
  isDisabledNextBtn: boolean;
};

function Pagination({ page, setPage, isDisabledNextBtn }: PaginationProps) {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setPage(+event.currentTarget.value);
    }
  };

  return (
    <div className="flex gap-3 mt-5 justify-end mr-1 h-9">
      <button
        type="button"
        className={cn(page < 2 ? "!bg-gray-400" : "", "btn-primary !px-6")}
        onClick={() => {
          setPage((prev) => Math.max(prev - 1, 1));
        }}
        disabled={page < 2}>
        <HiMiniArrowLongLeft className="h-6 w-6" />
      </button>

      <input
        className="w-16 !mb-0"
        defaultValue={page}
        type="number"
        onKeyDown={handleKeyPress}
      />

      <button
        type="button"
        className={cn(
          isDisabledNextBtn ? "!bg-gray-400" : "",
          "btn-primary !px-6"
        )}
        onClick={() => {
          setPage((prev) => prev + 1);
        }}
        disabled={isDisabledNextBtn}>
        <HiMiniArrowLongRight className="h-6 w-6" />
      </button>
    </div>
  );
}

export default Pagination;
