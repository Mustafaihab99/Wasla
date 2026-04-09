import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getTechAllBooking } from "../../api/technician/technician-api";

export default function useGetTechAllBooking(techId:string){
    return useQuery({
        queryKey:['tech-book-list' , techId , i18next.language],
        queryFn: ()=> getTechAllBooking(techId),
    })
}