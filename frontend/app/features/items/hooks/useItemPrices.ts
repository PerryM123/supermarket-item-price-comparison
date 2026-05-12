import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "~/lib/api";
import type { Price } from "./useItem";

export interface PricesPage {
  data: Price[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export function useItemPrices({
  id,
  page,
  sortBy,
  sortAsc,
}: {
  id: string;
  page: number;
  sortBy: string;
  sortAsc: boolean;
}) {
  return useQuery<PricesPage>({
    queryKey: ["items", id, "prices", { page, sortBy, sortAsc }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        sort_by: sortBy,
        sort_dir: sortAsc ? "asc" : "desc",
      });
      const r = await fetch(`${API_BASE}/items/${id}/prices?${params}`);
      if (!r.ok) throw new Error("Network error");
      return r.json();
    },
    staleTime: Infinity,
    gcTime: 1000 * 5
  });
}
