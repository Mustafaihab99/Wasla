import { useQuery } from "@tanstack/react-query";
import { getUserActivity } from "../../api/userEvent/userEvent-api";

export default function useGetUserActivity(userId:string){
    return useQuery({
        queryKey : ["events" , userId],
        queryFn : ()=> getUserActivity(userId)
    })
}