import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "~/lib/api";

export function useUpdateSupermarket(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const res = await fetch(`${API_BASE}/supermarkets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supermarkets"] });
    },
  });
}
