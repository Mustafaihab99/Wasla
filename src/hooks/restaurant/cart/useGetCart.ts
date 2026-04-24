import { useQuery } from "@tanstack/react-query";
import { getCart } from "../../../api/restaurant/restaurant-api";

export default function useGetCart(residentId:string , restaurantId:string){
    return useQuery({
        queryKey:["cart" , residentId , restaurantId],
        queryFn: ()=> getCart(residentId , restaurantId),
    })
}