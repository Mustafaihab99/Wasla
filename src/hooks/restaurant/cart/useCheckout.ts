import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutData } from "../../../types/restaurant/restaurant-types";
import { checkoutOrder } from "../../../api/restaurant/restaurant-api";

export default function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["checkout"],
    mutationFn: (formData: checkoutData) => checkoutOrder(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resident-order"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-order"] });
    },
  });
}