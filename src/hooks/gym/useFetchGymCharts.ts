import { useQuery } from "@tanstack/react-query";
import { fetchChartsGymData } from "../../api/gym/gym-api";

export default function useFetchGymCharts(gymId:string){
    return useQuery({
        queryKey:["gym-charts"],
        queryFn: ()=> fetchChartsGymData(gymId),
    })
}