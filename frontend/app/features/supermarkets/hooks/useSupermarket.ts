import { useQuery } from "@tanstack/react-query";
import { API_BASE, STATIC_QUERY_CONFIG } from "~/lib/api";

export interface Supermarket {
  id: number;
  name: string;
}

export function useSupermarket(id: string) {
  return useQuery<Supermarket>({
    queryKey: ["supermarkets", id],
    queryFn: async () => {
      const r = await fetch(`${API_BASE}/supermarkets/${id}`);
      if (!r.ok) throw new Error("Network error");
      return r.json();
    },
    ...STATIC_QUERY_CONFIG,
  });
}
