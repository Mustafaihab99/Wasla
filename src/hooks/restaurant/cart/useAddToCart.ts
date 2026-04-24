import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartData } from "../../../types/restaurant/restaurant-types";
import { AddToCart } from "../../../api/restaurant/restaurant-api";

export default function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-cart"],
    mutationFn: (formData: addToCartData) => AddToCart(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}