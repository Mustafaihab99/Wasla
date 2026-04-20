import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategoryMenu } from "../../api/restaurant/restaurant-api";
import { addCategoryMenuData } from "../../types/restaurant/restaurant-types";

export default function useAddCategoryMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-category"],
    mutationFn: (formData: addCategoryMenuData) => addCategoryMenu(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-menu"] });
    },
  });
}