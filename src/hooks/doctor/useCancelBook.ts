import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelDoctorBook } from "../../api/doctor/doctor-api";

export default function useCancelDoctorBook(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["cancel-book"],
          mutationFn: (bookingId: number) => cancelDoctorBook(bookingId),
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-book-list"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["mybooking"], exact: false });
    },
    })
}