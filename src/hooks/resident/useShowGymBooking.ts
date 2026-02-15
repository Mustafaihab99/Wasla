import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getGymResidnetBooking } from "../../api/gym/gym-api";

export default function useShowGymBooking(residentId:string){
    return useQuery({
        queryKey:['gym-booking' , residentId , i18next.language],
        queryFn: ()=> getGymResidnetBooking(residentId),
    })
}