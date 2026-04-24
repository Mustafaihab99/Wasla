import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteItemCart } from "../../../api/restaurant/restaurant-api";

export default function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove-cart"],
    mutationFn: ({
      cartItemId,
      residentId,
    }: {
      cartItemId: number;
      residentId: string;
    }) => deleteItemCart(cartItemId, residentId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}