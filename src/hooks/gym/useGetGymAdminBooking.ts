import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getGymAdminBooking } from "../../api/gym/gym-api";

export default function useGetGymAdminBooking(gymId:string , status:number){
    return useQuery({
        queryKey : ["gym-book-list" , i18next.language , status],
        queryFn: () => getGymAdminBooking(gymId , status)
    })
}