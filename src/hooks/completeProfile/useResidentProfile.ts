import { useMutation } from "@tanstack/react-query";
import { setResidentProfile } from "../../api/auth/complete-profile";

export default function useCompleteResidentProfile() {
  return useMutation({
    mutationKey: ["setResident"],
    mutationFn: (values: FormData) => setResidentProfile(values),
  });
}
