import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryMenu } from "../../api/restaurant/restaurant-api";

export default function useDeleteCategoryMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-category"],
    mutationFn: (id:number) => deleteCategoryMenu(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-menu"] });
    },
  });
}