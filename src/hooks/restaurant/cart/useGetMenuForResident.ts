import { useQuery } from "@tanstack/react-query";
import { getMenuDataForResident } from "../../../api/restaurant/restaurant-api";

export default function useGetMenuForResident(id:string){
    return useQuery({
        queryKey:["restaurant-charts"],
        queryFn: ()=> getMenuDataForResident(id),
    })
}