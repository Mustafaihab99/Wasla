import { useMutation } from "@tanstack/react-query";
import { EditProfile } from "../../api/auth/auth-api"; 

export default function useEditProfile(id: string) {
  return useMutation({
    mutationKey : ["edit-profile"],
    mutationFn: (formData: FormData) => EditProfile(formData, id),
  });
}
