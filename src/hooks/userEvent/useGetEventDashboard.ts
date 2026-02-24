import { useQuery } from "@tanstack/react-query";
import { getEventDashboard } from "../../api/userEvent/userEvent-api";

export default function useGetEventDashboard(){
    return useQuery({
        queryKey : ["admin-event"],
        queryFn : ()=> getEventDashboard()
    })
}