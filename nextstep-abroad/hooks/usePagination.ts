/**
 * usePagination — generic pagination helper hook.
 *
 * Calculates total pages and provides a typed onChange handler
 * so pagination logic isn't duplicated across list pages.
 */

import { useCallback } from "react";

interface UsePaginationOptions {
  total: number;
  limit: number;
  page: number;
  onPageChange: (page: number) => void;
}

export function usePagination({
  total,
  limit,
  page,
  onPageChange,
}: UsePaginationOptions) {
  const totalPages = Math.ceil(total / limit);

  const handleChange = useCallback(
    (_: React.ChangeEvent<unknown>, value: number) => {
      onPageChange(value);
    },
    [onPageChange]
  );

  return {
    totalPages,
    page,
    handleChange,
  };
}
