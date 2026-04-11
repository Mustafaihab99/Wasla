import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { allRestaurantSpecialzed } from "../../api/restaurant/restaurant-api";

export default function useGetRestaurantSpecial(){
    return useQuery({
        queryKey: ['restaurant-special' , i18next.language],
        queryFn: allRestaurantSpecialzed,
    })
}