import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editItemCart } from "../../../api/restaurant/restaurant-api";

export default function useEditCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-cart"],
    mutationFn: ({
      cartItemId,
      residentId,
      quantity,
    }: {
      cartItemId: number;
      residentId: string;
      quantity: number;
    }) =>
      editItemCart(cartItemId, residentId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}