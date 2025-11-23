import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoctorService } from "../../api/doctor/doctor-api";


export default function useAddDoctorService(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["add-doctorService"],
        mutationFn: addDoctorService,
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-services"], exact: false });
    },
    })
}