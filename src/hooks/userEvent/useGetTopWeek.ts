import { useQuery } from "@tanstack/react-query";
import { getTopWeek } from "../../api/userEvent/userEvent-api";

export default function useGetUserActivity(){
    return useQuery({
        queryKey : ["top-events"],
        queryFn : ()=> getTopWeek()
    })
}