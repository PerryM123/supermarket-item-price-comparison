import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "~/lib/api";
import { useNotificationStore } from "~/stores/useNotificationStore";

export function useCreateItem() {
  const queryClient = useQueryClient();
  const { show } = useNotificationStore();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      console.log('perry: A: formData: ', Object.fromEntries(formData));
      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        body: formData,
      });
      console.log('perry: B: res: ', res);
      if (!res.ok) throw new Error();
      console.log('perry: C: ', {
        resJson: res.json(),
        resOk: res.ok
      });
    },
    onSuccess: () => {
      console.log('perry: D');
      queryClient.invalidateQueries({ queryKey: ["items"] });
      console.log('perry: E');
      show("Item added successfully");
    },
  });
}
