import { useQuery } from "@tanstack/react-query";
import { showMyBooking } from "../../api/resident/resident-api";
import i18next from "i18next";

export default function useShowMyBooking(id:string){
    return useQuery({
        queryKey:['mybooking' , id , i18next.language],
        queryFn: ()=> showMyBooking(id),
    })
}