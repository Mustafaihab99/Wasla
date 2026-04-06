import { useMutation } from "@tanstack/react-query";
import { setTechnicanProfile } from "../../api/auth/complete-profile";

export default function useSetTechnicanProfile() {
  return useMutation({
    mutationKey: ["setTechnican"],
    mutationFn: (values: FormData) => setTechnicanProfile(values),
  });
}