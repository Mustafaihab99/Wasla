import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItemMenu } from "../../api/restaurant/restaurant-api";

export default function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-item"],
    mutationFn: (id:number) => deleteItemMenu(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });
    },
  });
}