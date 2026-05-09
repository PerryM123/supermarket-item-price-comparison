import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "~/lib/api";

interface CreatePriceVars {
  supermarket_id: number;
  price: number;
}

export function useCreatePrice(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: CreatePriceVars) => {
      const res = await fetch(`${API_BASE}/items/${id}/prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vars),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", id] });
    },
  });
}
