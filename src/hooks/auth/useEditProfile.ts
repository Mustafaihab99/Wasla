import { useMutation , useQueryClient } from "@tanstack/react-query";
import { EditProfile } from "../../api/auth/auth-api"; 

export default function useEditProfile(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey : ["edit-profile"],
    mutationFn: (formData: FormData) => EditProfile(formData, id),
        onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["residentProfile"], exact: false });
        },
  });
}
