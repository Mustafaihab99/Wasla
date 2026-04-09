import { useQuery } from "@tanstack/react-query";
import { fetchChartsTechData } from "../../api/technician/technician-api";

export default function useGetTechCharts(TechnicianId:string){
    return useQuery({
        queryKey:["tech-charts"],
        queryFn: ()=> fetchChartsTechData(TechnicianId),
    })
}