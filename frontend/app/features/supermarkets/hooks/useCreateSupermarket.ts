import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "~/lib/api";
import { useNotificationStore } from "~/stores/useNotificationStore";

export function useCreateSupermarket() {
  const queryClient = useQueryClient();
  const { show } = useNotificationStore();
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const res = await fetch(`${API_BASE}/supermarkets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supermarkets"] });
      show("Supermarket added successfully");
    },
  });
}
