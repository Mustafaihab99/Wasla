import { useQuery } from "@tanstack/react-query";
import { allSpecialzed } from "../../api/auth/complete-profile";
import i18next from "i18next";
export default function useDoctorSpecialezed(){
    return useQuery({
        queryKey:["doctor-special" , i18next.language],
        queryFn: allSpecialzed,
    });
}