import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDoctorBook } from "../../api/doctor/doctor-api";

export default function useUpdateDoctorBook(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["update-book"],
          mutationFn: updateDoctorBook,
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-book-list"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["mybooking"], exact: false });
    },
    })
}