import { useQuery } from "@tanstack/react-query";
import { getCategoryMenu } from "../../api/restaurant/restaurant-api";

export default function useGetCategoryMenu(id:string){
    return useQuery({
        queryKey:["category-menu" , id],
        queryFn: ()=> getCategoryMenu(id),
    })
}