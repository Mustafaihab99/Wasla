import { useQuery } from "@tanstack/react-query";
import { fetchBookingList } from "../../api/doctor/doctor-api";
import i18next from "i18next";

export default function useFetchDoctorBookingList(id:string , type:number){
    return useQuery({
        queryKey : ["doctor-book-list" , i18next.language , type],
        queryFn: () => fetchBookingList(id , type)
    })
}