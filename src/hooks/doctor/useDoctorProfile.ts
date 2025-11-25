import { useQuery } from "@tanstack/react-query";
import { getDoctorProfile } from "../../api/doctor/doctor-api";
import i18next from "i18next";

export default function useGetDoctorProfile(id:string){
    return useQuery({
        queryKey:["doctorProfile" , id , i18next.language],
        queryFn: ()=> getDoctorProfile(id),
    })
}