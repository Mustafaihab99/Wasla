import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getTechResidnetBooking } from "../../api/technician/technician-api";

export default function useShowtechBooking(residentId:string){
    return useQuery({
        queryKey:['tech-booking' , residentId , i18next.language],
        queryFn: ()=> getTechResidnetBooking(residentId),
    })
}