import { useQuery } from "@tanstack/react-query";
import { getResidentProfile } from "../../api/resident/resident-api";

export default function useGetResidentProfile(id:string){
    return useQuery({
        queryKey:["residentProfile" , id],
        queryFn: ()=> getResidentProfile(id),
    })
}