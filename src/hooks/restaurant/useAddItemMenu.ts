import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addItemMenu } from "../../api/restaurant/restaurant-api";

export default function useAddItemMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-item"],
    mutationFn: (formData: FormData) => addItemMenu(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });
    },
  });
}