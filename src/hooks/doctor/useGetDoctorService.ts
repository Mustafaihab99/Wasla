import { useQuery } from "@tanstack/react-query";
import i18next from "i18next";
import { getDoctorServices } from "../../api/doctor/doctor-api";

export default function useGetDoctorServices(id:string){
    return useQuery({
        queryKey : ["doctor-services" , i18next.language],
        queryFn : ()=> getDoctorServices(id)
    })
}