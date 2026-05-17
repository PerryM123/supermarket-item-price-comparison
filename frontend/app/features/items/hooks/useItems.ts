import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "~/lib/api";

export interface Item {
  id: number;
  name: string;
  imageUrl: string;
  created_at: string;
  updated_at: string;
}

interface ApiItem {
  id: number;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export function mapItem(item: ApiItem): Item {
  return {
    id: item.id,
    name: item.name,
    imageUrl: item.image_url,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

export function useItems() {
  return useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/items`);
      if (!response.ok) throw new Error("Network error");
      const result = await response.json();
      return result.items.map(mapItem);
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 10,
  });
}
