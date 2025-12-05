import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditDoctorProfile } from "../../api/doctor/doctor-api";

export default function useEditDoctorProfile(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["edit-doctor-profile"],
        mutationFn: EditDoctorProfile,
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorProfile"], exact: false });
    },
    })
}