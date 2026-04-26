import { useQuery } from "@tanstack/react-query";
import {  getPaymentHistory } from "../../api/resident/resident-api";

export default function useGetPaymentHistory(id:string){
    return useQuery({
        queryKey:["payment-history" , id],
        queryFn: ()=> getPaymentHistory(id),
    })
}