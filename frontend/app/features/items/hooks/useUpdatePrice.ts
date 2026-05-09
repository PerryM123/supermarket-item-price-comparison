import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "~/lib/api";

interface UpdatePriceVars {
  supermarket_id: number;
  price: number;
}

export function useUpdatePrice(id: string, priceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: UpdatePriceVars) => {
      const res = await fetch(`${API_BASE}/items/${id}/prices/${priceId}`, {
        method: "PUT",
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
