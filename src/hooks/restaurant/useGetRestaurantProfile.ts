import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getRestaurantProfile } from "../../api/restaurant/restaurant-api";

export default function useGetRestaurantProfile(id:string){
    return useQuery({
        queryKey:["restaurant-profile" , id , i18next.language],
        queryFn: ()=> getRestaurantProfile(id),
    })
}