import { useQuery } from "@tanstack/react-query";
import { fetchResidentCharts } from "../../api/resident/resident-api";

export default function useGetResidentCharts(id:string){
    return useQuery({
        queryKey: ["resident-charts" , id],
        queryFn: () => fetchResidentCharts(id)
    })
}