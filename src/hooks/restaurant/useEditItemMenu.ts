import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editItemMenu } from "../../api/restaurant/restaurant-api";

type editItemPayload = {
  formData: FormData;
  id: number;
};
export default function useEditItemMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-item"],
    mutationFn: ({formData, id} : editItemPayload) => editItemMenu(formData , id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-menu"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu"] });
    },
  });
}