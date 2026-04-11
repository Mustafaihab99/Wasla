import { useMutation } from "@tanstack/react-query";
import { setRestaurantProfile } from "../../api/restaurant/restaurant-api";

export default function useSetRestaurantProfile() {
  return useMutation({
    mutationKey: ["setRestaurant"],
    mutationFn: (values: FormData) => setRestaurantProfile(values),
  });
}