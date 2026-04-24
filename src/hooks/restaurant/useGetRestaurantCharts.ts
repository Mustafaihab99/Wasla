import { useQuery } from "@tanstack/react-query";
import { fetchChartsRestaurantData } from "../../api/restaurant/restaurant-api";

export default function useGetRestaurantCharts(id:string){
    return useQuery({
        queryKey:["restaurant-menu"],
        queryFn: ()=> fetchChartsRestaurantData(id),
    })
}