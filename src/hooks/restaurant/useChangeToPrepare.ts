import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeToPrepare } from "../../api/restaurant/restaurant-api";

export default function useChangeToPrpare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["prepare"],
    mutationFn: (id: number) => changeToPrepare(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resident-order"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-order"] });
    },
  });
}