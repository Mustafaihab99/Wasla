import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { fetchDoctorsToResident } from "../../api/resident/resident-api";

export default function useGetDoctorToResident(specialid:string){
    return useQuery({
        queryKey:["doctor-to-resident" , specialid ,i18next.language],
        queryFn: ()=> fetchDoctorsToResident(specialid),
    })
}