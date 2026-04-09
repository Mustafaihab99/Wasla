import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  RejectTechBook } from "../../api/technician/technician-api";

export default function useRejectTechBook(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["reject-tech-book"],
          mutationFn: (bookingId: number) => RejectTechBook(bookingId),
           onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tech-book-list"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["tech-booking"], exact: false });
    },
    })
}