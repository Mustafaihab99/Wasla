import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getTechnicinaProfile } from "../../api/technician/technician-api";

export default function useGetTechnicianProfile(id:string){
    return useQuery({
        queryKey:["technician-profile" , id , i18next.language],
        queryFn: ()=> getTechnicinaProfile(id),
    })
}