import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "~/lib/api";

export interface Supermarket {
  id: number;
  name: string;
}

export function useSupermarkets() {
  return useQuery<Supermarket[]>({
    queryKey: ["supermarkets"],
    queryFn: async () => {
      const r = await fetch(`${API_BASE}/supermarkets`);
      if (!r.ok) throw new Error("Network error");
      const data = await r.json();
      return data.supermarkets ?? [];
    },
  });
}
