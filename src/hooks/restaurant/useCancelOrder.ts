import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "../../api/restaurant/restaurant-api";

export default function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cancel-order"],
    mutationFn: ({
      orderId,
      isResident,
    }: {
      orderId: number;
      isResident: boolean;
    }) => cancelOrder(orderId, isResident),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resident-order"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["restaurant-order"], exact: false });
    },
  });
}