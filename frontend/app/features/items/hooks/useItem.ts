import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "~/lib/api";

export interface Price {
  id: number;
  price: number;
  created_at: string;
  supermarket: { id: number; name: string };
}

export interface Item {
  id: number;
  name: string;
  image_url: string | null;
  updated_at: string;
  prices: Price[];
}

export function useItem(id: string) {
  return useQuery<Item>({
    queryKey: ["items", id],
    queryFn: async () => {
      const r = await fetch(`${API_BASE}/items/${id}`);
      if (!r.ok) throw new Error("Network error");
      return r.json();
    },
  });
}
