import { useMutation } from "@tanstack/react-query";
import { setDoctorProfile } from "../../api/auth/complete-profile";

export default function useCompleteDoctorProfile() {
  return useMutation({
    mutationKey: ["setDoctor"],
    mutationFn: (values: FormData) => setDoctorProfile(values),
  });
}
