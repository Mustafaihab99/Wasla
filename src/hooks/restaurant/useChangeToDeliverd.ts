import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeToDeliverd } from "../../api/restaurant/restaurant-api";

export default function useChangeToDeliverd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deliverd"],
    mutationFn: (id: number) => changeToDeliverd(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resident-order"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-order"] });
    },
  });
}