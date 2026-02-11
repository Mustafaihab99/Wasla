import { useMutation } from "@tanstack/react-query";
import { setGymProfile } from "../../api/auth/complete-profile";

export default function useCompleteGym() {
  return useMutation({
    mutationKey: ["setGym"],
    mutationFn: (values: FormData) => setGymProfile(values),
  });
}
