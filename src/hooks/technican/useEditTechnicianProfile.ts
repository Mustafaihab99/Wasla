import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditTechnicianProfile } from "../../api/technician/technician-api";

export default function useEditTechnicianProfile(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["edit-tech-profile"],
        mutationFn: EditTechnicianProfile,
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-profile"], exact: false });
    },
    })
}