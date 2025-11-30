import { useQuery } from "@tanstack/react-query";
import { fetchChartsData } from "../../api/doctor/doctor-api";

export default function useFetchDoctorCharts(id:string){
    return useQuery({
        queryKey:["doctor-charts"],
        queryFn: ()=> fetchChartsData(id),
    })
}