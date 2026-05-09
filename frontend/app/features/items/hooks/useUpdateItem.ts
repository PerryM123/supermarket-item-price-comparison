import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "~/lib/api";

export function useUpdateItem(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${API_BASE}/items/${id}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", id] });
    },
  });
}
